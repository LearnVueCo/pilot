import {
  useEditor,
  type EditorOptions,
  type Extensions,
} from '@tiptap/vue-3'
import { StarterKitExtension } from '../extensions/starter-kit'
type Configuration = {
  editor: Partial<EditorOptions>
  extensions: Extensions
}

export function usePilot(config: Partial<Configuration> = {}) {
  const editorOptions: Partial<EditorOptions> = {
    ...config.editor,
    editorProps: {
      ...config.editor?.editorProps,
    },
    extensions: config.extensions ?? [StarterKitExtension()],
  }

  return {
    editor: useEditor(editorOptions)
  }
}
