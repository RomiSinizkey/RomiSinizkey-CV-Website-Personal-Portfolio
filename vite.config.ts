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

          return "vendor";
        },
      },
    },
  },
  base: mode === "production" ? "/RomiSinizkey-CV-Website-Personal-Portfolio/" : "/",
}));
