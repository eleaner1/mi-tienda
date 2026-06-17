import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import {
  categoryRouter,
  productRouter,
  offerRouter,
  cartRouter,
  orderRouter,
  inventoryRouter,
} from "./store-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({
    ok: true,
    ts: Date.now(),
  })),

  auth: authRouter,

  category: categoryRouter,
  product: productRouter,
  offer: offerRouter,
  cart: cartRouter,
  order: orderRouter,
  inventory: inventoryRouter,
});

export type AppRouter = typeof appRouter;