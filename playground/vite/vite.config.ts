import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: false,
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
})
