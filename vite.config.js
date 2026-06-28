import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.mpeg'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
          if (id.includes('SceneBalloons') || id.includes('SceneGallery') || id.includes('ScenePosters')) {
            return 'heavy-scenes';
          }
        }
      }
    },
    // Image optimization
    assetsInlineLimit: 4096, // Only inline images smaller than 4kb
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Enable compression for dev server
    middlewareMode: false,
  }
})
