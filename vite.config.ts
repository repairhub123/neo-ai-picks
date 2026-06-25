import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Raise warning threshold to 600KB (Firebase SDK is legitimately large)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ─── Firebase: always split into its own lazy chunk ───────────────
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          // ─── React ecosystem ──────────────────────────────────────────────
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // ─── Lucide icons ─────────────────────────────────────────────────
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
          // ─── Everything else stays in the main chunk ──────────────────────
        },
      },
    },
  },
})
