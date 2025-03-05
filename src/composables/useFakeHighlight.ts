import { ref } from 'vue'

import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DecorationSet, Decoration } from '@tiptap/pm/view'
import { type Editor, type Range } from '@tiptap/vue-3'
import { type MaybeRefOrGetter, onBeforeUnmount, onMounted, toValue } from 'vue'

type UseFakeHighlightOptions = {
  highlightClass?: string
}

function hasValidSelection(editor: Editor) {
  return (
    !editor.state.selection.empty &&
    editor.state.selection.from &&
    editor.state.selection.to
  )
}
export function useFakeHighlight(
  editorRef: MaybeRefOrGetter<Editor | null | undefined>,
  options: UseFakeHighlightOptions = {},
) {
  const { highlightClass = 'bg-blue/50' } = options
  const position = ref<Range | null>(null)
  const key = new PluginKey('fake-highlight')
  const META_KEY = 'fake-highlight'

  const shouldHighlight = ref(true)

  function updateDecoration() {
    const editor = toValue(editorRef)
    if (!editor || !shouldHighlight.value) {
      return
    }
    // this value can be anything, it's just a flag to trigger the plugin
    const transaction = editor.state.tr.setMeta(META_KEY, 'run')
    editor.view.dispatch(transaction)
  }

  function highlight(range?: Range) {
    const editor = toValue(editorRef)
    if (!editor) {
      return
    }
    if (range || hasValidSelection(editor)) {
      position.value = range ?? {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      }

      updateDecoration()
    }
  }

  function unhighlight() {
    position.value = null
    updateDecoration()
  }

  onMounted(() => {
    const editor = toValue(editorRef)
    if (!editor) {
      return
    }
    editor.registerPlugin(
      new Plugin({
        key: key,
        state: {
          init(_config, state) {
            return DecorationSet.create(state.doc, [])
          },
          apply(tr, oldState) {
            // Skip if this transaction wasn't triggered by our highlight update
            if (!tr.getMeta(META_KEY)) {
              return oldState
            }
            if (position.value && shouldHighlight.value) {
              const decoration = Decoration.inline(
                position.value.from,
                position.value.to,
                {
                  class: highlightClass,
                },
              )
              return DecorationSet.create(tr.doc, [decoration])
            }
            return DecorationSet.create(tr.doc, [])
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    )
  })

  onBeforeUnmount(() => {
    const editor = toValue(editorRef)
    if (editor) {
      editor.unregisterPlugin(key)
    }
  })

  return {
    highlight,
    unhighlight,
  }
}
