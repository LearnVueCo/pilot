import path from "path"

export default defineNuxtConfig({
  modules: ['../src/nuxt',  '@nuxt/ui-pro', '@nuxt/content',],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  css: ['~~/app/assets/styles.css', '~~/app/assets/editor.css'],
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          theme: 'dracula',
        },
      },
    },
  },
  hooks: {
    'components:extend': (components) => {
      const globals = components.filter((c) =>
        ['UButton', 'UIcon', 'UAlert',].includes(c.pascalName),
      )

      globals.forEach((c) => (c.global = true))
    },
  },
  vite: {
    resolve: {
      alias: {
        '@learnvue/pilot': path.resolve(__dirname, '../src'),
      },
    },
  },    
})
