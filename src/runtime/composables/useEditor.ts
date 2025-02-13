import {
  useEditor as createEditor,
  type Range,
  type EditorOptions,
  type NodeViewProps,
  VueNodeViewRenderer,
  VueRenderer,
} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
import Image from '@tiptap/extension-image'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Markdown } from 'tiptap-markdown'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import Command from '../extensions/command'
import suggestion from '../extensions/suggestion'
import { defu } from 'defu'
import { UploadImagesPlugin } from '../plugins/upload-image'
import ListItem from '../components/pm/ListItem.vue'
import type { Component } from 'vue'

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
    TaskItem.extend({
      addNodeView() {
        return VueNodeViewRenderer(ListItem as Component<NodeViewProps>)
      },
    }),
    TaskList,
    CodeBlockShiki.configure({
      defaultTheme: 'dracula',
    }).extend({
      addKeyboardShortcuts() {
        return {
          Tab: () => {
            const TAB_CHAR = '\u00A0\u00A0\u00A0\u00A0'
            if (this.editor.isActive('codeBlock')) {
              const { empty, from, to } = this.editor.state.selection
              if (empty) {
                return this.editor
                  .chain()
                  .command(({ tr }) => {
                    tr.insertText(TAB_CHAR)
                    return true
                  })
                  .run()
              }
              // Handle selected text indentation
              const lines = this.editor.state.doc
                .textBetween(from, to)
                .split('\n')

              return this.editor
                .chain()
                .deleteRange({ from, to })
                .command(({ tr }) => {
                  for (let i = 0; i < lines.length; i++) {
                    tr.insertText(TAB_CHAR)
                    tr.insertText(lines[i])
                    if (i < lines.length - 1) {
                      tr.insertText('\n')
                    }
                  }
                  return true
                })
                .setTextSelection({
                  from: from,
                  to: to + TAB_CHAR.length * lines.length,
                })
                .run()
            }
            return true
          },
          'Shift-Tab': () => {
            if (this.editor.isActive('codeBlock')) {
              const { empty, from, to } = this.editor.state.selection
              const TAB_CHAR = '\u00A0\u00A0\u00A0\u00A0'

              if (empty) {
                const pos = from - TAB_CHAR.length
                const textBefore = this.editor.state.doc.textBetween(pos, from)
                if (textBefore === TAB_CHAR) {
                  return this.editor
                    .chain()
                    .deleteRange({ from: pos, to: from })
                    .run()
                }
                return false
              }

              // Handle selected text outdentation
              const lines = this.editor.state.doc
                .textBetween(from, to)
                .split('\n')
              const outdentedText = lines.map((line) =>
                line.startsWith(TAB_CHAR) ? line.slice(TAB_CHAR.length) : line,
              )
              return this.editor
                .chain()
                .deleteRange({ from, to })
                .command(({ tr }) => {
                  for (let i = 0; i < outdentedText.length; i++) {
                    tr.insertText(outdentedText[i])
                    if (i < outdentedText.length - 1) {
                      tr.insertText('\n')
                    }
                  }
                  return true
                })
                .setTextSelection({
                  from: from,
                  to: to - TAB_CHAR.length * lines.length,
                })
                .run()
            }
            return false
          },
        }
      },
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
    }).extend({
      addProseMirrorPlugins() {
        return [
          UploadImagesPlugin({
            imageClass: 'opacity-30 animate-pulse',
          }),
        ]
      },
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
