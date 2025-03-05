import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponentsDir,
  addImports,
} from '@nuxt/kit'
import { consola } from 'consola'
// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pilot',
    configKey: 'pilot',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('./components'),
    })

    addImports([
      {
        name: 'useTitle',
        as: 'useTitle',
        from: resolver.resolve('./composables/useTitle'),
      },
      {
        name: 'useEditor',
        as: 'useEditor',
        from: resolver.resolve('./composables/useEditor'),
      },
      {
        name: 'useTooltip',
        as: 'useTooltip',
        from: resolver.resolve('./composables/useTooltip'),
      },
      {
        name: 'useLinkHover',
        as: 'useLinkHover',
        from: resolver.resolve('./composables/useLinkHover'),
      },
      {
        name: 'useFakeHighlight',
        as: 'useFakeHighlight',
        from: resolver.resolve('./composables/useFakeHighlight'),
      },
      {
        name: 'commandActions',
        as: 'commandActions',
        from: resolver.resolve('./utils/commands'),
      },
    ])
  },
})
