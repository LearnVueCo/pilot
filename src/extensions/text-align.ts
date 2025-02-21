import { TextAlign, type TextAlignOptions } from '@tiptap/extension-text-align'
import { defu } from 'defu'

export type TextAlignExtensionOptions = Partial<TextAlignOptions>

export const TextAlignExtension = (options: TextAlignExtensionOptions = {}) => {
  const defaultOptions: Partial<TextAlignOptions> = {
    types: ['paragraph'],
  }

  const mergedOptions = defu(options, defaultOptions)

  return TextAlign.configure(mergedOptions).extend({
    addKeyboardShortcuts() {
      return {}
    },
  })
}
