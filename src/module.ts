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
    name: 'pencil',
    configKey: 'pencil',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
    })
    addImports({
      name: 'useEditor',
      as: 'useEditor',
      from: resolver.resolve('./runtime/composables/useEditor'),
    })
    addImports({
      name: 'useTitle',
      as: 'useTitle',
      from: resolver.resolve('./runtime/composables/useTitle'),
    })
    nuxt.options.css.push(
      resolver.resolve('./runtime/assets/styles/editor.css'),
    )
  },
})
