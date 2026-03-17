import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api/open-meteo-geocode": {
        target: "https://geocoding-api.open-meteo.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/api\/open-meteo-geocode/, ""),
      },
    },
  },
  base: mode === "production" ? "/RomiSinizkey-CV-Website-Personal-Portfolio/" : "/",
}));
