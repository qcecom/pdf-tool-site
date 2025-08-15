import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  worker: { format: "es" },
  resolve: { dedupe: ["react", "react-dom"] },
  build: { chunkSizeWarningLimit: 500 }
});
