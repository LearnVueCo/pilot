// Vue imports
import type { Component } from 'vue'

// Tiptap core
import { Extension, VueNodeViewRenderer } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
// Tiptap extensions
import StarterKit, { type StarterKitOptions } from '@tiptap/starter-kit'
import TaskItem, { type TaskItemOptions } from '@tiptap/extension-task-item'
import TaskList, { type TaskListOptions } from '@tiptap/extension-task-list'
import Image, { type ImageOptions } from '@tiptap/extension-image'
import { Link, type LinkOptions } from '@tiptap/extension-link'
import {
  Placeholder,
  type PlaceholderOptions,
} from '@tiptap/extension-placeholder'

// Custom Plugins
import { UploadImagesPlugin, type UploadFn } from '../../plugins/upload-image'

// Third party extensions
import {
  CodeBlockShiki,
  type CodeBlockShikiOptions,
} from 'tiptap-extension-code-block-shiki'
import GlobalDragHandle, {
  type GlobalDragHandleOptions,
} from 'tiptap-extension-global-drag-handle'
import { Markdown, type MarkdownOptions } from 'tiptap-markdown'

// Utilities
import { defu } from 'defu'
import { TextAlign, type TextAlignOptions } from '@tiptap/extension-text-align'

export type StarterKitExtensionOptions = Partial<StarterKitOptions>
export const StarterKitExtension = (
  options: StarterKitExtensionOptions = {},
) => {
  const defaultOptions: Partial<StarterKitOptions> = {
    heading: {
      levels: [1, 2, 3],
    },
    codeBlock: false,
    horizontalRule: {
      HTMLAttributes: {
        'data-type': 'draggable',
      },
    },
    dropcursor: {
      color: '#ff00ff',
    },
  }

  const mergedOptions = defu(options, defaultOptions)

  return StarterKit.configure(mergedOptions).extend({
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          const handleEnter = () =>
            this.editor.commands.first(({ commands }) => [
              () => commands.newlineInCode(),
              () => commands.createParagraphNear(),
              () => commands.liftEmptyBlock(),
              () => commands.splitBlock(),
            ])

          handleEnter()
          this.editor
            .chain()
            .command(({ tr }) => {
              tr.setStoredMarks([])
              return true
            })
            .run()

          return true
        },
      }
    },
  })
}

export type TaskItemExtensionOptions = Partial<
  TaskItemOptions & {
    customComponent?: Component<NodeViewProps>
  }
>
export const TaskItemExtension = (options: TaskItemExtensionOptions = {}) => {
  const defaultOptions: TaskItemExtensionOptions = {
    nested: true,
  } as const

  const mergedOptions = defu(options, defaultOptions)

  return TaskItem.configure(mergedOptions).extend(
    mergedOptions.customComponent
      ? {
          addNodeView() {
            return VueNodeViewRenderer(mergedOptions.customComponent!)
          },
        }
      : {},
  )
}

export type TaskListExtensionOptions = Partial<TaskListOptions>

export const TaskListExtension = (options: TaskListExtensionOptions = {}) => {
  const defaultOptions: Partial<TaskListOptions> = {}

  const mergedOptions = defu(options, defaultOptions)

  return TaskList.configure(mergedOptions)
}

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
    inline: true,
    allowBase64: true,
  }).extend({
    addProseMirrorPlugins() {
      return uploadFn
        ? [
            UploadImagesPlugin({
              loadingClass: loadingClass!,
            }),
          ]
        : []
    },
  })
}

export type LinkExtensionOptions = Partial<
  LinkOptions & {
    openOnMetaClick: boolean
  }
>

export const LinkExtension = (options: LinkExtensionOptions = {}) => {
  const defaultOptions: Partial<LinkExtensionOptions> = {
    openOnClick: false,
    openOnMetaClick: true,
    autolink: false,
  }

  const mergedOptions = defu(options, defaultOptions)

  const { openOnMetaClick } = mergedOptions

  return Link.configure(mergedOptions).extend({
    addProseMirrorPlugins() {
      return [
        ...(openOnMetaClick
          ? [
              new Plugin({
                key: new PluginKey('linkClickHandler'),
                props: {
                  handleClick: (view, _pos, event) => {
                    const qualifiedClick =
                      event.button === 1 ||
                      (event.button === 0 && (event.metaKey || event.ctrlKey))

                    if (!view.editable || !qualifiedClick) {
                      return false
                    }

                    let target = event.target as HTMLElement
                    while (
                      target !== null &&
                      target.nodeName !== 'A' &&
                      target.nodeName !== 'DIV'
                    ) {
                      target = target.parentNode as HTMLElement
                    }

                    if (target?.nodeName !== 'A') {
                      return false
                    }

                    const href = target.getAttribute('href')
                    if (href === null) {
                      return false
                    }

                    window.open(href, '_blank', 'noopener noreferrer')
                    return true
                  },
                },
              }),
            ]
          : []),
      ]
    },
  })
}

export type CodeBlockExtensionOptions = Partial<CodeBlockShikiOptions> & {
  customComponent?: Component<NodeViewProps>
}

export const CodeBlockExtension = (options: CodeBlockExtensionOptions = {}) => {
  const defaultOptions: Partial<CodeBlockExtensionOptions> = {
    defaultTheme: 'everforest-light',
  }

  const mergedOptions = defu(options, defaultOptions)

  return CodeBlockShiki.configure(mergedOptions)
    .extend({
      addKeyboardShortcuts() {
        return {
          Tab: () => {
            const TAB_CHAR = '\t'
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
            return false
          },
          'Shift-Tab': () => {
            if (this.editor.isActive('codeBlock')) {
              const { empty, from, to } = this.editor.state.selection
              const TAB_CHAR = '\t'

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
              // move the text back to the nearest tab stop
              const outdentedText = lines.map((line) => {
                return line.replace(TAB_CHAR, '')
              })
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
    })
    .extend(
      mergedOptions.customComponent
        ? {
            addNodeView() {
              return VueNodeViewRenderer(mergedOptions.customComponent!)
            },
          }
        : {},
    )
}

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

export type LinkHoverExtensionOptions = {
  /**
   * Called when a mouse enters a link
   * @param el - The `a` element that the mouse entered
   * @param range - The start/end editor range of the link being hovered if it exists in the editor
   *
   */
  onMouseOver: (el: HTMLElement, range?: { start: number; end: number }) => void
  /**
   * Called when a mouse leaves a link
   * @param el - The `a` element that the mouse left
   */
  onMouseLeave: (el: HTMLElement) => void
}

export const LinkHoverExtension = (
  options: Partial<LinkHoverExtensionOptions> = {},
) => {
  const { onMouseOver, onMouseLeave } = options

  if (!onMouseOver && !onMouseLeave) {
    return
  }

  return Extension.create({
    name: 'handleLinkHover',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('hover'),
          props: {
            handleDOMEvents: {
              mouseover(view, event) {
                const el = event.target as HTMLElement
                if (el.tagName !== 'A') {
                  return
                }
                el.setAttribute('data-hovered', 'true')

                onMouseOver?.(
                  el,
                  el.pmViewDesc
                    ? {
                        start: el.pmViewDesc.posAtStart,
                        end: el.pmViewDesc.posAtEnd,
                      }
                    : undefined,
                )
              },
              mouseout(view, event) {
                if ((event.target as HTMLElement).tagName !== 'A') {
                  return
                }
                onMouseLeave?.(event.target as HTMLElement)
              },
            },
          },
        }),
      ]
    },
  })
}

export type DragHandleExtensionOptions = Partial<GlobalDragHandleOptions>

export const DragHandleExtension = (
  options: DragHandleExtensionOptions = {},
) => {
  const defaultOptions: Partial<GlobalDragHandleOptions> = {
    customNodes: ['draggable'],
  }

  const mergedOptions = defu(options, defaultOptions)

  return GlobalDragHandle.configure(mergedOptions)
}

export type MarkdownExtensionOptions = Partial<MarkdownOptions>

export const MarkdownExtension = (options: MarkdownExtensionOptions = {}) => {
  const defaultOptions: Partial<MarkdownOptions> = {
    html: true,
    tightLists: true,
    tightListClass: 'tight',
    bulletListMarker: '-',
    linkify: false,
    breaks: false,
    transformPastedText: true,
    transformCopiedText: true,
  }

  const mergedOptions = defu(options, defaultOptions)

  return Markdown.configure(mergedOptions)
}

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
