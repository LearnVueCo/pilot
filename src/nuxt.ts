import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImportsDir
} from '@nuxt/kit'
// Module options TypeScript interface definition
export interface ModuleOptions {
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pilot',
    configKey: 'pilot',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const optimizeDeps = nuxt.options.vite.optimizeDeps
    nuxt.options.vite.optimizeDeps = {
      include: [...(optimizeDeps?.include ?? []), 'tiptap-markdown'],
      exclude: [...(optimizeDeps?.exclude ?? []), '@tiptap/pm'],
    }
    const resolver = createResolver(import.meta.url)

    const prefix = options.prefix || ''

    addComponentsDir({
      path: resolver.resolve('./components'),
      prefix: prefix,
      ignore: ['**/*.!(vue)'],
    })
  
    addImportsDir([
      resolver.resolve('./composables'),
      resolver.resolve('./extensions'),
      resolver.resolve('./extensions/bundles'),
      resolver.resolve('./utils'),
    ])

  },
})
