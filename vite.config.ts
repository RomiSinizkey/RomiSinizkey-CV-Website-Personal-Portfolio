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
  // רק בפרודקשן (deploy) נוסיף base של הריפו
  base: mode === "production" ? "/RomiSinizkey-CV-Website-Personal-Portfolio/" : "/",
}));
