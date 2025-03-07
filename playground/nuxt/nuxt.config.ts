import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    '../../src/module'
  ],
  css: [
    '~/assets/style.css',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2025-02-07',
  vite: {
    plugins: [tailwindcss()],
  },  
})