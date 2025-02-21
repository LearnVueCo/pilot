import Image, { type ImageOptions } from '@tiptap/extension-image'
import { defu } from 'defu'
import { UploadImagesPlugin, type UploadFn } from '../utils/upload-image'

export type ImageExtensionOptions = Partial<
  ImageOptions & {
    loadingClass?: string
    uploadFn?: UploadFn
  }
>

export const ImageExtension = (options: ImageExtensionOptions = {}) => {
  const defaultOptions: Partial<ImageExtensionOptions> = {
    loadingClass: 'opacity-30 animate-pulse',
  }

  const mergedOptions = defu(options, defaultOptions)

  const { loadingClass, uploadFn } = mergedOptions

  return Image.configure({
    inline: false,
    allowBase64: true,
  }).extend({
    addProseMirrorPlugins() {
      return [
        UploadImagesPlugin({
          imageUploadFn: uploadFn,
          loadingClass: loadingClass,
        }),
      ]
    },
  })
}
