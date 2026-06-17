import { z } from "zod";
import { createRouter, publicQuery, adminQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  categories,
  products,
  offers,
  cartItems,
  orders,
  orderItems,
} from "@db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();

    return db
      .select()
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(categories.name);
  }),

  listAll: adminQuery.query(async () => {
    const db = getDb();

    return db.select().from(categories).orderBy(categories.name);
  }),

  getById: publicQuery
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const db = getDb();

      const results = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      return results[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const result = await db.insert(categories).values({
        name: input.name,
        description: input.description,
        image: input.image,
      });

      return {
        id: Number(result[0]?.insertId ?? 0),
        success: true,
      };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(categories)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.image !== undefined && { image: input.image }),
          ...(input.active !== undefined && { active: input.active }),
        })
        .where(eq(categories.id, input.id));

      return { success: true };
    }),

  delete: adminQuery
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db.delete(categories).where(eq(categories.id, input.id));

      return { success: true };
    }),
});

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          categoryId: z.number().optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();

      const conditions = [eq(products.active, true)];

      if (input?.categoryId) {
        conditions.push(eq(products.categoryId, input.categoryId));
      }

      if (input?.search) {
        conditions.push(
          sql`(${products.name} LIKE ${`%${input.search}%`} OR ${products.brand} LIKE ${`%${input.search}%`})`,
        );
      }

      const whereClause =
        conditions.length > 1 ? and(...conditions) : conditions[0];

      return db
        .select()
        .from(products)
        .where(whereClause)
        .limit(input?.limit ?? 20)
        .offset(input?.offset ?? 0)
        .orderBy(desc(products.createdAt));
    }),

  mostBought: publicQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(8),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();

      return db
        .select()
        .from(products)
        .where(eq(products.active, true))
        .orderBy(desc(products.mostBought))
        .limit(input?.limit ?? 8);
    }),

  onOffer: publicQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(8),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const now = new Date();

      const result = await db
        .select({
          product: products,
          offer: offers,
        })
        .from(products)
        .innerJoin(offers, eq(offers.productId, products.id))
        .where(
          and(
            eq(products.active, true),
            eq(offers.active, true),
            sql`${offers.startDate} <= ${now}`,
            sql`${offers.endDate} >= ${now}`,
          ),
        )
        .limit(input?.limit ?? 8);

      return result;
    }),

  getById: publicQuery
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const db = getDb();

      const results = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);

      return results[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        brand: z.string().optional(),
        price: z.string().or(z.number()),
        stock: z.number().min(0).default(0),
        image: z.string().optional(),
        categoryId: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const result = await db.insert(products).values({
        name: input.name,
        description: input.description,
        brand: input.brand,
        price: String(input.price),
        stock: input.stock,
        image: input.image,
        categoryId: input.categoryId,
      });

      return {
        id: Number(result[0]?.insertId ?? 0),
        success: true,
      };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        brand: z.string().optional(),
        price: z.string().or(z.number()).optional(),
        stock: z.number().min(0).optional(),
        image: z.string().optional(),
        categoryId: z.number().optional(),
        active: z.boolean().optional(),
        mostBought: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const updates: Record<string, unknown> = {};

      if (input.name !== undefined) updates.name = input.name;
      if (input.description !== undefined) updates.description = input.description;
      if (input.brand !== undefined) updates.brand = input.brand;
      if (input.price !== undefined) updates.price = String(input.price);
      if (input.stock !== undefined) updates.stock = input.stock;
      if (input.image !== undefined) updates.image = input.image;
      if (input.categoryId !== undefined) updates.categoryId = input.categoryId;
      if (input.active !== undefined) updates.active = input.active;
      if (input.mostBought !== undefined) updates.mostBought = input.mostBought;

      await db.update(products).set(updates).where(eq(products.id, input.id));

      return { success: true };
    }),

  delete: adminQuery
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db.delete(products).where(eq(products.id, input.id));

      return { success: true };
    }),

  search: publicQuery
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const searchTerm = `%${input.query}%`;

      return db
        .select()
        .from(products)
        .where(
          and(
            eq(products.active, true),
            sql`(${products.name} LIKE ${searchTerm} OR ${products.brand} LIKE ${searchTerm})`,
          ),
        )
        .orderBy(desc(products.mostBought))
        .limit(20);
    }),

  byCategory: publicQuery
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const db = getDb();

      return db
        .select()
        .from(products)
        .where(
          and(
            eq(products.active, true),
            eq(products.categoryId, input.categoryId),
          ),
        )
        .orderBy(desc(products.mostBought));
    }),

  updateStock: adminQuery
    .input(
      z.object({
        id: z.number(),
        stock: z.number().min(0),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(products)
        .set({
          stock: input.stock,
        })
        .where(eq(products.id, input.id));

      return { success: true };
    }),
});

export const offerRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const now = new Date();

    return db
      .select()
      .from(offers)
      .where(
        and(
          eq(offers.active, true),
          sql`${offers.startDate} <= ${now}`,
          sql`${offers.endDate} >= ${now}`,
        ),
      );
  }),

  listAll: adminQuery.query(async () => {
    const db = getDb();

    return db.select().from(offers).orderBy(desc(offers.createdAt));
  }),

  create: adminQuery
    .input(
      z.object({
        productId: z.number(),
        discountPercent: z.number().min(1).max(99),
        endDate: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const result = await db.insert(offers).values({
        productId: input.productId,
        discountPercent: input.discountPercent,
        endDate: input.endDate ? new Date(input.endDate) : new Date(),
      });

      return {
        id: Number(result[0]?.insertId ?? 0),
        success: true,
      };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        discountPercent: z.number().min(1).max(99).optional(),
        endDate: z.string().optional(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const updates: Record<string, unknown> = {};

      if (input.discountPercent !== undefined) {
        updates.discountPercent = input.discountPercent;
      }

      if (input.endDate !== undefined) {
        updates.endDate = new Date(input.endDate);
      }

      if (input.active !== undefined) {
        updates.active = input.active;
      }

      await db.update(offers).set(updates).where(eq(offers.id, input.id));

      return { success: true };
    }),

  delete: adminQuery
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db.delete(offers).where(eq(offers.id, input.id));

      return { success: true };
    }),
});

export const cartRouter = createRouter({
  getCart: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, ctx.user.id));

    if (items.length === 0) {
      return [];
    }

    const productIds = items.map((item) => item.productId);

    const productsList = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(
      productsList.map((product) => [product.id, product]),
    );

    return items
      .map((item) => ({
        ...item,
        product: productMap.get(item.productId) ?? null,
      }))
      .filter((item) => item.product !== null);
  }),

  add: authedQuery
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const productRows = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId))
        .limit(1);

      const product = productRows[0];

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      if (!product.active) {
        throw new Error("Este producto no está disponible");
      }

      if (product.stock <= 0) {
        throw new Error("Este producto no tiene stock disponible");
      }

      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.userId, ctx.user.id),
            eq(cartItems.productId, input.productId),
          ),
        )
        .limit(1);

      const currentQuantity = existing.length > 0 ? existing[0].quantity : 0;
      const newQuantity = currentQuantity + input.quantity;

      if (newQuantity > product.stock) {
        throw new Error(`Solo hay ${product.stock} unidades disponibles`);
      }

      if (existing.length > 0) {
        await db
          .update(cartItems)
          .set({
            quantity: newQuantity,
          })
          .where(eq(cartItems.id, existing[0].id));
      } else {
        await db.insert(cartItems).values({
          userId: ctx.user.id,
          productId: input.productId,
          quantity: input.quantity,
        });
      }

      return { success: true };
    }),

  updateQuantity: authedQuery
    .input(
      z.object({
        cartItemId: z.number(),
        quantity: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const cartRows = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.id, input.cartItemId),
            eq(cartItems.userId, ctx.user.id),
          ),
        )
        .limit(1);

      const cartItem = cartRows[0];

      if (!cartItem) {
        throw new Error("Producto no encontrado en el carrito");
      }

      const productRows = await db
        .select()
        .from(products)
        .where(eq(products.id, cartItem.productId))
        .limit(1);

      const product = productRows[0];

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      if (input.quantity > product.stock) {
        throw new Error(`Solo hay ${product.stock} unidades disponibles`);
      }

      await db
        .update(cartItems)
        .set({
          quantity: input.quantity,
        })
        .where(
          and(
            eq(cartItems.id, input.cartItemId),
            eq(cartItems.userId, ctx.user.id),
          ),
        );

      return { success: true };
    }),

  remove: authedQuery
    .input(
      z.object({
        cartItemId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      await db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.id, input.cartItemId),
            eq(cartItems.userId, ctx.user.id),
          ),
        );

      return { success: true };
    }),

  clear: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();

    await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));

    return { success: true };
  }),
});

export const orderRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number(),
            unitPrice: z.string().or(z.number()),
          }),
        ),
        total: z.string().or(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      for (const item of input.items) {
        const productRows = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        const product = productRows[0];

        if (!product) {
          throw new Error("Uno de los productos no existe");
        }

        if (item.quantity > product.stock) {
          throw new Error(
            `Solo hay ${product.stock} unidades disponibles de ${product.name}`,
          );
        }
      }

      const result = await db.insert(orders).values({
        userId: ctx.user.id,
        total: String(input.total),
        status: "pending",
      });

      const orderId = Number(result[0]?.insertId ?? 0);

      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: String(item.unitPrice),
        });

        await db
          .update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
            mostBought: sql`${products.mostBought} + ${item.quantity}`,
          })
          .where(eq(products.id, item.productId));
      }

      await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));

      return {
        orderId,
        success: true,
      };
    }),

  myOrders: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));
  }),

  getById: authedQuery
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();

      const orderResults = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, input.id), eq(orders.userId, ctx.user.id)))
        .limit(1);

      if (orderResults.length === 0) {
        return null;
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, input.id));

      if (items.length === 0) {
        return {
          ...orderResults[0],
          items: [],
        };
      }

      const productIds = items.map((item) => item.productId);

      const productsList = await db
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      const productMap = new Map(
        productsList.map((product) => [product.id, product]),
      );

      return {
        ...orderResults[0],
        items: items.map((item) => ({
          ...item,
          product: productMap.get(item.productId) ?? null,
        })),
      };
    }),

  listAll: adminQuery.query(async () => {
    const db = getDb();

    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "completed", "cancelled"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(orders)
        .set({
          status: input.status,
        })
        .where(eq(orders.id, input.id));

      return { success: true };
    }),
});

export const inventoryRouter = createRouter({
  getInventory: adminQuery.query(async () => {
    const db = getDb();

    return db
      .select({
        id: products.id,
        name: products.name,
        brand: products.brand,
        stock: products.stock,
        price: products.price,
        mostBought: products.mostBought,
        active: products.active,
      })
      .from(products)
      .orderBy(products.name);
  }),

  summary: adminQuery.query(async () => {
    const db = getDb();

    const allProducts = await db.select().from(products);

    const totalProducts = allProducts.length;
    const totalStock = allProducts.reduce((sum, product) => {
      return sum + product.stock;
    }, 0);
    const lowStock = allProducts.filter((product) => product.stock < 10).length;
    const outOfStock = allProducts.filter((product) => product.stock === 0).length;

    return {
      totalProducts,
      totalStock,
      lowStock,
      outOfStock,
    };
  }),
});