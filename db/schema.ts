import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

// Usuarios
export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  unionId: varchar("unionId", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 255 }),

  email: varchar("email", { length: 320 }).unique(),

  password: varchar("password", { length: 255 }),

  avatar: text("avatar"),

  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),

  phone: varchar("phone", { length: 50 }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Categorías
export const categories = mysqlTable("categories", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  description: text("description"),

  image: text("image"),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Productos
export const products = mysqlTable("products", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  description: text("description"),

  brand: varchar("brand", { length: 255 }),

  price: decimal("price", { precision: 10, scale: 2 }).notNull(),

  stock: int("stock").default(0).notNull(),

  image: text("image"),

  categoryId: bigint("categoryId", {
    mode: "number",
    unsigned: true,
  }).references(() => categories.id),

  mostBought: int("mostBought").default(0).notNull(),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Ofertas
export const offers = mysqlTable("offers", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  productId: bigint("productId", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => products.id),

  discountPercent: int("discountPercent").notNull(),

  startDate: timestamp("startDate").defaultNow().notNull(),

  // Corregido: MariaDB/XAMPP daba error si quedaba timestamp nullable sin default
  endDate: timestamp("endDate").defaultNow().notNull(),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = typeof offers.$inferInsert;

// Carrito
export const cartItems = mysqlTable("cartItems", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  userId: bigint("userId", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => users.id),

  productId: bigint("productId", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => products.id),

  quantity: int("quantity").default(1).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// Órdenes
export const orders = mysqlTable("orders", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  userId: bigint("userId", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => users.id),

  status: mysqlEnum("status", [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ])
    .default("pending")
    .notNull(),

  total: decimal("total", { precision: 10, scale: 2 }).notNull(),

  whatsappSent: boolean("whatsappSent").default(false).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Items de órdenes
export const orderItems = mysqlTable("orderItems", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  orderId: bigint("orderId", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => orders.id),

  productId: bigint("productId", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => products.id),

  quantity: int("quantity").notNull(),

  unitPrice: decimal("unitPrice", {
    precision: 10,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;