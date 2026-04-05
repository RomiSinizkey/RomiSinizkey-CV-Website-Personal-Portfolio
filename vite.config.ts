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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("react-router-dom") || id.includes("react-router")) {
            return "router-vendor";
          }

          if (id.includes("react-dom")) {
            return "react-dom-vendor";
          }

          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }

          if (id.includes("framer-motion")) {
            return "motion-vendor";
          }

          if (id.includes("@lottiefiles") || id.includes("lottie-web")) {
            return "lottie-vendor";
          }

          return "vendor";
        },
      },
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
