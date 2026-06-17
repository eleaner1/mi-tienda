import { useState } from "react";
import { Link } from "react-router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Package,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
} from "lucide-react";

interface PaidItem {
  productId: number;
  quantity: number;
  product: { name: string; price: string; image: string | null; brand: string | null } | null;
}

// ---------- Checkout con PayPal ----------

interface PayPalCheckoutProps {
  total: number;
  items: {
    productId: number;
    quantity: number;
    product: { price: string } | null;
  }[];
  clientId: string;
  onSuccess: (total: number, orderId: number | null) => void;
  onCancel: () => void;
}

function PayPalCheckout({
  total,
  items,
  clientId,
  onSuccess,
  onCancel,
}: PayPalCheckoutProps) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [paypalError, setPaypalError] = useState("");

  const createPayPalOrder = trpc.payment.createPayPalOrder.useMutation();
  const captureAndCreateOrder = trpc.payment.captureAndCreateOrder.useMutation({
    onSuccess: () => {
      utils.order.myOrders.invalidate();
      utils.cart.getCart.invalidate();
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-blue-50 border-blue-200 p-3 text-sm text-blue-800">
        <p className="font-medium mb-1 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Pago seguro con PayPal
        </p>
        <p className="text-xs text-blue-700">
          Puedes pagar con tu cuenta PayPal o con cualquier tarjeta de débito/crédito sin necesidad de cuenta PayPal.
        </p>
      </div>

      {paypalError && (
        <div className="flex items-center gap-2 text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 p-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {paypalError}
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            label: "pay",
            shape: "rect",
            color: "blue",
          }}
          disabled={createPayPalOrder.isPending || captureAndCreateOrder.isPending}
          createOrder={async () => {
            setPaypalError("");
            try {
              const { paypalOrderId } = await createPayPalOrder.mutateAsync({
                amount: total.toFixed(2),
                currency: "USD",
                items: items.map((item) => ({
                  name: item.product?.name ?? "Producto",
                  quantity: item.quantity,
                  unitPrice: parseFloat(item.product?.price ?? "0").toFixed(2),
                  productId: item.productId,
                })),
              });
              return paypalOrderId;
            } catch (err) {
              const msg = (err as Error).message || "Error al iniciar el pago";
              setPaypalError(msg);
              throw err;
            }
          }}
          onApprove={async (data) => {
            setPaypalError("");
            try {
              if (isAuthenticated) {
                const result = await captureAndCreateOrder.mutateAsync({
                  paypalOrderId: data.orderID,
                  items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.product?.price ?? "0",
                  })),
                  total: total.toFixed(2),
                });
                onSuccess(total, result.orderId);
              } else {
                onSuccess(total, null);
              }
            } catch (err) {
              const msg = (err as Error).message || "Error al confirmar el pago";
              setPaypalError(msg);
              toast.error(msg);
            }
          }}
          onError={() => {
            setPaypalError(
              "PayPal no pudo procesar el pago. Intenta de nuevo o usa otra tarjeta.",
            );
          }}
          onCancel={() => {
            toast.info("Pago cancelado");
          }}
        />
      </PayPalScriptProvider>

      <Button
        variant="outline"
        className="w-full"
        onClick={onCancel}
        disabled={captureAndCreateOrder.isPending}
      >
        Volver al carrito
      </Button>

      {(createPayPalOrder.isPending || captureAndCreateOrder.isPending) && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Procesando pago, no cierres esta ventana...
        </p>
      )}
    </div>
  );
}

// ---------- Pantalla de éxito + comprobante ----------

function downloadReceipt(orderId: number | null, total: number, items: PaidItem[], message?: string | null, userName?: string | null, userEmail?: string | null) {
  const date = new Date().toLocaleString("es-NI", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const rows = items.map((item) => {
    const unit = parseFloat(item.product?.price ?? "0");
    const sub = (unit * item.quantity).toFixed(2);
    return `<tr>
      <td style="padding:8px;border:1px solid #ddd">${item.product?.name ?? "Producto"}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">$${unit.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">$${sub}</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <title>Comprobante${orderId ? " #" + orderId : ""}</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:20px;color:#1a1a1a}
    h1{border-bottom:2px solid #eee;padding-bottom:12px;margin-bottom:8px}
    .info{background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:12px;margin-bottom:16px;font-size:13px}
    .info p{margin:4px 0}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th{background:#f5f5f5;padding:8px;text-align:left;border:1px solid #ddd;font-size:13px}
    .total-row{font-weight:bold;background:#f0f9ff}
    .badge{display:inline-block;background:#22c55e;color:#fff;border-radius:4px;padding:2px 10px;font-size:12px}
    .footer{margin-top:24px;font-size:13px;color:#555;border-top:1px solid #eee;padding-top:12px}
    @media print{.no-print{display:none}}
  </style></head><body>
  <h1>Comprobante de Pago</h1>
  <p><span class="badge">✓ Pago completado</span></p>
  <div class="info">
    ${orderId ? `<p><strong>Orden #${orderId}</strong></p>` : ""}
    <p>Fecha: ${date}</p>
    <p>Método: PayPal</p>
    ${userName ? `<p>Cliente: <strong>${userName}</strong></p>` : ""}
    ${userEmail ? `<p>Correo: ${userEmail}</p>` : ""}
  </div>
  <table>
    <thead><tr>
      <th>Producto</th><th style="text-align:center">Cant.</th>
      <th style="text-align:right">Precio unit.</th><th style="text-align:right">Subtotal</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr class="total-row">
      <td colspan="3" style="padding:8px;border:1px solid #ddd;text-align:right">Total pagado</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:right">$${total.toFixed(2)}</td>
    </tr></tfoot>
  </table>
  ${message ? `<div class="footer"><strong>Información de contacto:</strong><br>${message.replace(/\n/g, "<br>")}</div>` : ""}
  <div class="footer">Gracias por tu compra.</div>
  <br><button class="no-print" onclick="window.print()" style="padding:10px 20px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Imprimir / Guardar PDF</button>
  </body></html>`;

  const win = window.open("", "_blank");
  if (!win) { toast.error("Permite ventanas emergentes para descargar el comprobante"); return; }
  win.document.write(html);
  win.document.close();
}

function buildWhatsAppMessage(orderId: number | null, total: number, items: PaidItem[], userName?: string | null, userEmail?: string | null) {
  let msg = `¡Hola! Acabo de realizar un pago en tu tienda.\n\n`;
  if (orderId) msg += `*Orden #${orderId}*\n`;
  if (userName) msg += `Cliente: ${userName}\n`;
  if (userEmail) msg += `Correo: ${userEmail}\n`;
  msg += `\n*Productos comprados:*\n`;
  for (const item of items) {
    const price = parseFloat(item.product?.price ?? "0");
    msg += `• ${item.product?.name ?? "Producto"} × ${item.quantity} = $${(price * item.quantity).toFixed(2)}\n`;
  }
  msg += `\n*Total pagado: $${total.toFixed(2)}*\n`;
  msg += `\nPago realizado vía PayPal ✓`;
  return msg;
}

function SuccessScreen({
  total,
  orderId,
  items,
  storeMessage,
  isAuthenticated,
  userName,
  userEmail,
  whatsappPhone,
}: {
  total: number;
  orderId: number | null;
  items: PaidItem[];
  storeMessage?: string | null;
  isAuthenticated: boolean;
  userName?: string | null;
  userEmail?: string | null;
  whatsappPhone?: string | null;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="py-8 space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">¡Pago exitoso!</h2>
            <p className="text-muted-foreground text-center">
              Se procesó <strong className="text-foreground">${total.toFixed(2)}</strong> vía PayPal.
              {orderId && <> Orden <strong className="text-foreground">#{orderId}</strong>.</>}
            </p>
            {(userName || userEmail) && (
              <div className="text-center text-sm text-muted-foreground">
                {userName && <p className="font-medium text-foreground">{userName}</p>}
                {userEmail && <p>{userEmail}</p>}
              </div>
            )}
          </div>

          {/* Detalle de la compra */}
          {items.length > 0 && (
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted px-4 py-2 text-sm font-semibold">Detalle de la compra</div>
              <div className="divide-y">
                {items.map((item, i) => {
                  const unit = parseFloat(item.product?.price ?? "0");
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product?.image ? (
                          <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name ?? "Producto"}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity} · ${unit.toFixed(2)} c/u</p>
                      </div>
                      <p className="font-semibold text-sm">${(unit * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-muted/50 px-4 py-3 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {storeMessage && (
            <div className="rounded-lg border bg-blue-50 border-blue-200 p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">Información de contacto</p>
              <p className="whitespace-pre-line">{storeMessage}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => downloadReceipt(orderId, total, items, storeMessage, userName, userEmail)}
              >
                <Download className="w-4 h-4" />
                Descargar comprobante
              </Button>
              {whatsappPhone && (
                <Button
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    const phone = whatsappPhone.replace(/\D/g, "");
                    const msg = buildWhatsAppMessage(orderId, total, items, userName, userEmail);
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar por WhatsApp
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">Seguir comprando</Button>
              </Link>
              {isAuthenticated && (
                <Link to="/orders" className="flex-1">
                  <Button className="w-full">Ver mis pedidos</Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Componente principal ----------

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { isAuthenticated, user } = useAuth();

  const { data: storeInfo } = trpc.settings.get.useQuery();
  const { data: paypalConfig } = trpc.payment.paypalClientId.useQuery();

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paidTotal, setPaidTotal] = useState(0);
  const [paidOrderId, setPaidOrderId] = useState<number | null>(null);
  const [paidItems, setPaidItems] = useState<PaidItem[]>([]);
  const [paidUserName, setPaidUserName] = useState<string | null>(null);
  const [paidUserEmail, setPaidUserEmail] = useState<string | null>(null);
  const [paidWhatsappPhone, setPaidWhatsappPhone] = useState<string | null>(null);

  const handleSuccess = (total: number, orderId: number | null) => {
    setPaidTotal(total);
    setPaidOrderId(orderId);
    setPaidItems(items.map((i) => ({ productId: i.productId, quantity: i.quantity, product: i.product })));
    setPaidUserName(user?.name ?? null);
    setPaidUserEmail(user?.email ?? null);
    setPaidWhatsappPhone(storeInfo?.bankPhone ?? null);
    clearCart();
    setShowCheckout(false);
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <SuccessScreen
        total={paidTotal}
        orderId={paidOrderId}
        items={paidItems}
        storeMessage={storeInfo?.additionalInfo}
        isAuthenticated={isAuthenticated}
        userName={paidUserName}
        userEmail={paidUserEmail}
        whatsappPhone={paidWhatsappPhone}
      />
    );
  }

  const paypalConfigured =
    paypalConfig?.clientId && !paypalConfig.clientId.includes("REEMPLAZA");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Carrito de compras
        </h1>
        {totalItems > 0 && (
          <Badge variant="secondary" className="text-sm">
            {totalItems} items
          </Badge>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Tu carrito está vacío</p>
            <p className="text-sm mt-2">Agrega productos para comenzar</p>
            <Link to="/" className="mt-6">
              <Button>Seguir comprando</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Lista de productos */}
          <div className="space-y-3">
            {items.map((item) => {
              const stock = item.product?.stock ?? 0;
              const reachedStock = item.quantity >= stock;
              return (
                <Card key={item.productId}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {item.product?.name}
                        </h3>
                        {item.product?.brand && (
                          <p className="text-sm text-muted-foreground">
                            {item.product.brand}
                          </p>
                        )}
                        <p className="font-bold mt-1">
                          ${parseFloat(item.product?.price || "0").toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Stock: {stock}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              disabled={item.quantity <= 1}
                              onClick={() => {
                                if (item.quantity > 1)
                                  updateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  );
                              }}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              min={1}
                              max={stock}
                              value={item.quantity}
                              onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (Number.isNaN(val)) val = 1;
                                if (val < 1) val = 1;
                                if (val > stock) {
                                  val = stock;
                                  toast.error(
                                    `Solo hay ${stock} unidades disponibles`,
                                  );
                                }
                                updateQuantity(item.id, val);
                              }}
                              className="w-16 h-8 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              disabled={reachedStock}
                              onClick={() => {
                                if (item.quantity < stock)
                                  updateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  );
                                else
                                  toast.error(
                                    `Solo hay ${stock} unidades disponibles`,
                                  );
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Quitar
                          </Button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-lg">
                          $
                          {(
                            item.quantity *
                            parseFloat(item.product?.price || "0")
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Resumen + pago */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} producto{totalItems !== 1 ? "s" : ""})
                </span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-amber-50 border-amber-200 p-4 text-sm text-amber-800">
                    <p className="font-semibold mb-1">Necesitas una cuenta para comprar</p>
                    <p>Inicia sesión o crea una cuenta gratuita para pagar y ver el historial de tus pedidos.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/login?redirect=/cart" className="flex-1">
                      <Button className="w-full">Iniciar sesión</Button>
                    </Link>
                    <Link to="/register?redirect=/cart" className="flex-1">
                      <Button variant="outline" className="w-full">Crear cuenta</Button>
                    </Link>
                  </div>
                </div>
              ) : !showCheckout ? (
                <>
                  {!paypalConfigured && (
                    <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        PayPal no está configurado. Agrega tus credenciales en
                        el archivo <code className="font-mono">.env</code>.
                      </span>
                    </div>
                  )}
                  <Button
                    className="w-full h-12 text-base gap-2"
                    disabled={!paypalConfigured}
                    onClick={() => setShowCheckout(true)}
                  >
                    <CreditCard className="w-5 h-5" />
                    Pagar con PayPal
                  </Button>
                </>
              ) : (
                paypalConfigured && (
                  <PayPalCheckout
                    total={totalPrice}
                    items={items}
                    clientId={paypalConfig!.clientId}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowCheckout(false)}
                  />
                )
              )}

              <Button
                variant="ghost"
                className="w-full text-destructive"
                onClick={clearCart}
              >
                Vaciar carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
