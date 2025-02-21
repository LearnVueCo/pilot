import { useEditor as createEditor, type EditorOptions } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { defu } from 'defu'

const TitleDocument = Document.extend({
  content: 'title',
  topNode: true,
})

const Title = Heading.extend({
  name: 'title',
  group: 'title',
  parseHTML: () => [{ tag: 'h1:first-child' }],
}).configure({ levels: [1] })

const defaultOptions: Partial<EditorOptions> = {
  content: '<h1></h1>',
  extensions: [
    TitleDocument,
    Text,
    Title,
    Placeholder.configure({
      placeholder: 'Untitled Note',
    }),
  ],
}
export function useTitle(config: Partial<EditorOptions> = {}) {
  const options = defu(config, defaultOptions)
  return createEditor(options)
}
