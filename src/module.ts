import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
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
  setup(options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    const prefix = options.prefix || ''

    addComponentsDir({
      path: resolver.resolve('./components'),
      prefix: prefix
    })

  },
})
