import {
  useEditor as createEditor,
  Extension,
  type EditorOptions,
  type Extensions,
} from '@tiptap/vue-3'
import { createCommands, type EditorCommand } from '../utils/commands'
import { StarterKitExtension } from '../extensions/starter-kit'
type Configuration = {
  editor: Partial<EditorOptions>
  commands?: EditorCommand[]
  extensions: Extensions
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
    },
    extensions: config.extensions ?? [StarterKitExtension()],
  }

  return {
    editor: createEditor(editorOptions),
    commands: createCommands(config.commands),
  }
}
