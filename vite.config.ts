import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from './scripts/rollup-plugin-visualizer.js';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({
      filename: 'dist/stats.html',
      title: 'Bundle Stats',
      gzipSize: true,
      brotliSize: true
    })
  ],
  worker: { format: 'es' },
  resolve: { dedupe: ['react', 'react-dom'] },
  build: {
    chunkSizeWarningLimit: 500,
    manifest: 'manifest.json',
    rollupOptions: {
      external: ['tesseract.js'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('tesseract.js') || id.includes('pdfjs-dist')) return 'pdf-ocr-vendor';
            if (id.includes('@dnd-kit')) return 'dnd-vendor';
            return 'vendor';
          }
        }
      }
    }
  },
  esbuild: { legalComments: 'none' }
});
