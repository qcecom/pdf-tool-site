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
    // Workers must use an ESM format to allow code-splitting
    format: "esm",
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
});
