import path from 'path'

export default defineNuxtConfig({
  modules: ['../../src/nuxt'],
  devtools: { enabled: true },
  compatibilityDate: '2025-02-07',
  pilot: {
    prefix: 'Pilot'
  },
  vite: {
    resolve: {
      alias: {
        '@learnvue/pilot': path.resolve(__dirname, '../../src'),
      }
    }
  }
})
