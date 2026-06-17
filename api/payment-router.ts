import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems, products, cartItems } from "@db/schema";
import { eq, sql } from "drizzle-orm";

// ---------- PayPal helpers ----------

function getPayPalBase() {
  return process.env.PAYPAL_SANDBOX !== "false"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || clientId.includes("REEMPLAZA")) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Configura PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en el archivo .env",
    });
  }

  const base64 = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${getPayPalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No se pudo conectar con PayPal. Verifica tus credenciales en .env",
    });
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// ---------- Router ----------

export const paymentRouter = createRouter({
  // Devuelve el clientId de PayPal al frontend
  paypalClientId: publicQuery.query(() => {
    const id = process.env.VITE_PAYPAL_CLIENT_ID ?? process.env.PAYPAL_CLIENT_ID ?? "";
    const sandbox = process.env.PAYPAL_SANDBOX !== "false";
    return { clientId: id, sandbox };
  }),

  // Crea la orden de pago en PayPal
  createPayPalOrder: authedQuery
    .input(
      z.object({
        amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto inválido"),
        currency: z.string().length(3).default("USD"),
        items: z
          .array(
            z.object({
              name: z.string().max(127),
              quantity: z.number().int().min(1),
              unitPrice: z.string(),
              productId: z.number(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const token = await getPayPalToken();

      // Construir la sección de items para PayPal si se proveyeron
      const paypalItems = input.items?.map((item) => ({
        name: item.name.slice(0, 127),
        quantity: String(item.quantity),
        unit_amount: {
          currency_code: input.currency,
          value: parseFloat(item.unitPrice).toFixed(2),
        },
        sku: String(item.productId),
      }));

      const purchaseUnit: Record<string, unknown> = {
        amount: {
          currency_code: input.currency,
          value: input.amount,
          ...(paypalItems && {
            breakdown: {
              item_total: { currency_code: input.currency, value: input.amount },
            },
          }),
        },
        ...(paypalItems && { items: paypalItems }),
      };

      const res = await fetch(`${getPayPalBase()}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [purchaseUnit],
          application_context: {
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            brand_name: "MiTienda",
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error al crear la orden en PayPal: ${err}`,
        });
      }

      const order = (await res.json()) as { id: string; status: string };
      return { paypalOrderId: order.id };
    }),

  // Captura el pago (cobra al comprador) y crea la orden en la BD
  captureAndCreateOrder: authedQuery
    .input(
      z.object({
        paypalOrderId: z.string().min(1),
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().int().min(1),
            unitPrice: z.string(),
          }),
        ),
        total: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Capturar el pago con PayPal (el dinero se debita del comprador)
      const token = await getPayPalToken();

      const captureRes = await fetch(
        `${getPayPalBase()}/v2/checkout/orders/${input.paypalOrderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!captureRes.ok) {
        const err = await captureRes.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `PayPal rechazó el pago: ${err}`,
        });
      }

      const capture = (await captureRes.json()) as {
        status: string;
        purchase_units?: Array<{
          payments?: {
            captures?: Array<{ id: string; status: string }>;
          };
        }>;
      };

      if (capture.status !== "COMPLETED") {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: `El pago no fue completado (estado: ${capture.status})`,
        });
      }

      // 2. Verificar stock antes de crear la orden
      const db = getDb();

      for (const item of input.items) {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Uno de los productos ya no existe",
          });
        }

        if (item.quantity > product.stock) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Solo quedan ${product.stock} unidades de "${product.name}"`,
          });
        }
      }

      // 3. Crear la orden en la base de datos
      const result = await db.insert(orders).values({
        userId: ctx.user.id,
        total: input.total,
        status: "pending",
      });

      const orderId = Number(result[0]?.insertId ?? 0);

      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });

        await db
          .update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
            mostBought: sql`${products.mostBought} + ${item.quantity}`,
          })
          .where(eq(products.id, item.productId));
      }

      // 4. Limpiar el carrito del usuario
      await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));

      return { orderId, success: true };
    }),
});
