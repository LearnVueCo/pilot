import {
  useEditor as createEditor,
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
