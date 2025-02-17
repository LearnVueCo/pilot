import {
  useEditor as createEditor,
  Extension,
  type EditorOptions,
} from '@tiptap/vue-3'
import {
  StarterKitExtension,
  TaskItemExtension,
  TaskListExtension,
  ImageExtension,
  LinkExtension,
  CodeBlockExtension,
  PlaceholderExtension,
  LinkHoverExtension,
  DragHandleExtension,
  MarkdownExtension,
  TextAlignExtension,
} from '../utils/editor/extensions'
import type {
  CodeBlockExtensionOptions,
  ImageExtensionOptions,
  LinkExtensionOptions,
  PlaceholderExtensionOptions,
  StarterKitExtensionOptions,
  TaskItemExtensionOptions,
  TaskListExtensionOptions,
  DragHandleExtensionOptions,
  MarkdownExtensionOptions,
  LinkHoverExtensionOptions,
  TextAlignExtensionOptions,
} from '../utils/editor/extensions'
import Command from '../extensions/command'
import suggestion from '../extensions/suggestion'
import { createCommands } from '../utils/editor/commands'
import type { EditorCommand } from '../utils/editor/commands'
import { handleImagePaste } from '../plugins/upload-image'

type Configuration = {
  editor: Partial<EditorOptions>
  extensions: Partial<{
    /**
     * Includes all options for `@tiptap/starter-kit`
     * @see https://tiptap.dev/extensions/starter-kit
     */
    StarterKitExtension: StarterKitExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-task-item`
     * @see https://tiptap.dev/extensions/task-item
     */
    TaskItemExtension: TaskItemExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-task-list`
     * @see https://tiptap.dev/extensions/task-list
     */
    TaskListExtension: TaskListExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-image`
     * @see https://tiptap.dev/extensions/image
     */
    ImageExtension: ImageExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-link`
     * @see https://tiptap.dev/extensions/link
     */
    LinkExtension: LinkExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-placeholder`
     * @see https://tiptap.dev/extensions/placeholder
     */
    PlaceholderExtension: PlaceholderExtensionOptions
    /**
     * Includes all options for `tiptap-extension-global-drag-handle`
     * @see https://github.com/NiclasDev63/tiptap-extension-global-drag-handle
     */
    DragHandleExtension: DragHandleExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-code-block`
     * @see https://tiptap.dev/extensions/code-block
     */
    CodeBlockExtension: CodeBlockExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-markdown`
     * @see https://tiptap.dev/extensions/markdown
     */
    MarkdownExtension: MarkdownExtensionOptions
    /**
     * Includes all options for `tiptap-extension-link-hover`
     */
    LinkHoverExtension: LinkHoverExtensionOptions
    /**
     * Includes all options for `@tiptap/extension-text-align`
     * @see https://tiptap.dev/extensions/text-align
     */
    TextAlignExtension: TextAlignExtensionOptions
  }>
  commands?: EditorCommand[]
}

/**
 * Creates an optional extension. Allows for extensions to be conditionally added.
 * @param condition - Whether the extension should be created.
 * @param callback - The callback to create the extension.
 * @returns The extension or an empty array if the condition is false.
 */
function createOptionalExtension(
  condition: boolean,
  callback: () => Extension | undefined,
) {
  if (!condition) {
    return []
  }
  const extension = callback()

  return extension ? [extension] : []
}

export function useEditor(config: Partial<Configuration> = {}) {
  const editorOptions: Partial<EditorOptions> = {
    ...config.editor,
    editorProps: {
      ...config.editor?.editorProps,
      handlePaste: (view, event, slice) => {
        if (config.extensions?.ImageExtension?.uploadFn) {
          const isPasteHandled = handleImagePaste(
            view,
            event,
            config.extensions?.ImageExtension?.uploadFn,
          )

          // The paste event was handled by the imageUpload plugin, so there's no need to process it further
          if (isPasteHandled) {
            return true
          }
        }
        if (config.editor?.editorProps?.handlePaste) {
          return config.editor.editorProps.handlePaste(view, event, slice)
        }
      },
    },
    extensions: [
      StarterKitExtension(config.extensions?.StarterKitExtension),
      TaskItemExtension(config.extensions?.TaskItemExtension),
      TaskListExtension(config.extensions?.TaskListExtension),
      ImageExtension(config.extensions?.ImageExtension),
      LinkExtension(config.extensions?.LinkExtension),
      CodeBlockExtension(config.extensions?.CodeBlockExtension),
      PlaceholderExtension(config.extensions?.PlaceholderExtension),
      DragHandleExtension(config.extensions?.DragHandleExtension),
      MarkdownExtension(config.extensions?.MarkdownExtension),
      TextAlignExtension(config.extensions?.TextAlignExtension),
      Command.configure({
        suggestion,
      }),
      ...createOptionalExtension(!!config.extensions?.LinkHoverExtension, () =>
        LinkHoverExtension({
          onMouseOver: config.extensions?.LinkHoverExtension?.onMouseOver,
          onMouseLeave: config.extensions?.LinkHoverExtension?.onMouseLeave,
        }),
      ),
    ],
  }
  return {
    editor: createEditor(editorOptions),
    commands: createCommands(config.commands),
  }
}
