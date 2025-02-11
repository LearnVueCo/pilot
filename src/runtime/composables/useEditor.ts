import { useEditor as createEditor, type EditorOptions } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
import Image from '@tiptap/extension-image'
import { Markdown } from 'tiptap-markdown'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'

import Command from '../extensions/command'
import suggestion from '../extensions/suggestion'
import { defu } from 'defu'

const defaultOptions: Partial<EditorOptions> = {
  content: '<h1></h1>',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      codeBlock: false,
      horizontalRule: {
        HTMLAttributes: {
          'data-type': 'draggable',
        },
      },
    }),
    CodeBlockShiki.configure({
      defaultTheme: 'dracula',
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return `Heading ${node.attrs.level}`
        }
        return "Start typing, press '/' for commands"
      },
      includeChildren: true,
    }),
    GlobalDragHandle.configure({
      customNodes: ['draggable'],
    }),
    Command.configure({
      suggestion,
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Markdown.configure({
      html: true, // Allow HTML input/output
      tightLists: true, // No <p> inside <li> in markdown output
      tightListClass: 'tight', // Add class to <ul> allowing you to remove <p> margins when tight
      bulletListMarker: '-', // <li> prefix in markdown output
      linkify: false, // Create links from "https://..." text
      breaks: false, // New lines (\n) in markdown input are converted to <br>
      transformPastedText: true, // Allow to paste markdown text in the editor
      transformCopiedText: true, // Copied text is transformed to markdown
    }),
  ],
}
export function useEditor(config: Partial<EditorOptions> = {}) {
  const options = defu(config, defaultOptions)
  return createEditor(options)
}
