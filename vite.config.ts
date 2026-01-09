import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: "./test-cert.pem",
      key: "./test-key.pem",
    },
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
  build: {
    outDir: "dist/static",
  },
});
