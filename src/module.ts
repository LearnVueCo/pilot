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

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
    })

    addImports([
      {
        name: 'createImageUpload',
        as: 'createImageUpload',
        from: resolver.resolve('./runtime/plugins/upload-image'),
      },
      {
        name: 'handleImagePaste',
        as: 'handleImagePaste',
        from: resolver.resolve('./runtime/plugins/upload-image'),
      },
      {
        name: 'handleImageDrop',
        as: 'handleImageDrop',
        from: resolver.resolve('./runtime/plugins/upload-image'),
      },
      {
        name: 'preloadImage',
        as: 'preloadImage',
        from: resolver.resolve('./runtime/plugins/upload-image'),
      },
      {
        name: 'useTitle',
        as: 'useTitle',
        from: resolver.resolve('./runtime/composables/useTitle'),
      },
      {
        name: 'useEditor',
        as: 'useEditor',
        from: resolver.resolve('./runtime/composables/useEditor'),
      },
      {
        name: 'useTooltip',
        as: 'useTooltip',
        from: resolver.resolve('./runtime/composables/useTooltip'),
      },
      {
        name: 'useLinkHover',
        as: 'useLinkHover',
        from: resolver.resolve('./runtime/composables/useLinkHover'),
      },
      {
        name: 'useLinkEdit',
        as: 'useLinkEdit',
        from: resolver.resolve('./runtime/composables/useLinkEdit'),
      },
    ])
  },
})
