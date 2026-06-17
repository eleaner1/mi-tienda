import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import path from "path";

export default defineConfig({
  plugins: [
    devServer({
      entry: "api/boot.ts",
      // Solo Hono maneja /api/*; todo lo demás va a Vite (React app)
      exclude: [
        /^\/(?!api\/).*/,
        ...defaultOptions.exclude,
      ],
    }),
    react(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@db": path.resolve(__dirname, "./db"),
      "@api": path.resolve(__dirname, "./api"),
      "@contracts": path.resolve(__dirname, "./contracts"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
});
