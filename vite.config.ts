import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  resolve: {
    alias: { "@": "/src" },
    dedupe: ["react", "react-dom"],
  },
  worker: {
    format: "es",
    rollupOptions: {
      output: { format: "es" },
    },
  },
  build: {
    rollupOptions: {
      output: { format: "es" },
    },
    target: "es2020",
  },
});
