import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { VitePWA } from "vite-plugin-pwa";
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
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "MiTienda",
        short_name: "MiTienda",
        description: "Tu tienda online de confianza. Encuentra los mejores productos al mejor precio.",
        theme_color: "#1a2b8c",
        background_color: "#1a2b8c",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,webp,ico,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@db": path.resolve(__dirname, "./db"),
      "@api": path.resolve(__dirname, "./api"),
      "@contracts": path.resolve(__dirname, "./contracts"),
    },
  },

  build: {
    outDir: "dist/public",
  },

  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
});
