import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

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

    hmr: {
      protocol: "wss",
      clientPort: 443,
    },
  },
});