import Image, { type ImageOptions } from '@tiptap/extension-image'
import { UploadImagesPlugin, type UploadFn } from '../utils/upload-image'

export type ImageExtensionOptions = Partial<
  ImageOptions & {
    loadingClass?: string
    uploadFn?: UploadFn
  }
>

export const ImageExtension = (options: ImageExtensionOptions = {}) => {

  const { loadingClass = 'opacity-30 animate-pulse', uploadFn } = options

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
