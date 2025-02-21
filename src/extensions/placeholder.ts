import {
  Placeholder,
  type PlaceholderOptions,
} from '@tiptap/extension-placeholder'
import { defu } from 'defu'

export type PlaceholderExtensionOptions = Partial<PlaceholderOptions>

export const PlaceholderExtension = (
  options: PlaceholderExtensionOptions = {},
) => {
  const defaultOptions: Partial<PlaceholderExtensionOptions> = {
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`
      }
      return "Start typing, press '/' for commands"
    },
    includeChildren: true,
  }

  const mergedOptions = defu(options, defaultOptions)

  return Placeholder.configure(mergedOptions)
}
