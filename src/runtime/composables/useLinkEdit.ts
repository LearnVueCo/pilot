import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { Editor, type Range } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
type UseLinkEditOptions = {
  highlight?: boolean
  highlightClass?: string
}

export function useLinkEdit(
  editor: Ref<Editor | null | undefined>,
  options: UseLinkEditOptions = {},
) {
  const { highlight = true, highlightClass = 'bg-blue/50' } = options

  const position = ref<Range | null>(null)
  const editing = ref(false)
  const url = ref('')
  const linkText = ref<string>()
  const isNewLink = ref(false)

  function updateDecoration() {
    if (!editor.value || !highlight) {
      return
    }
    const transaction = editor.value.state.tr.setMeta('run', 'run')
    editor.value.view.dispatch(transaction)
  }

  function initializeLinkEdit(pos?: Range) {
    if (!editor.value) {
      return
    }
    if (pos && (pos.from < 0 || pos.to < pos.from)) {
      console.warn('Invalid position range provided')
      return
    }
    if (
      pos ||
      (!editor.value?.state.selection.empty &&
        editor.value?.state.selection.from &&
        editor.value?.state.selection.to)
    ) {
      position.value = pos ?? {
        from: editor.value?.state.selection.from,
        to: editor.value?.state.selection.to,
      }

      editor.value.chain().focus().setTextSelection(position.value).run()
      url.value = ''
      isNewLink.value = true
      if (editor.value.getAttributes('link').href) {
        url.value = editor.value.getAttributes('link').href
        linkText.value = editor.value.state.doc.textBetween(
          position.value.from,
          position.value.to,
        )
        isNewLink.value = false
      }
      updateDecoration()
      editing.value = true
    }
  }

  function setLink() {
    if (!editor.value) {
      return
    }
    if (!position.value) {
      editing.value = false
      return
    }
    if (linkText.value) {
      editor.value
        ?.chain()
        .insertContentAt(position.value, linkText.value)
        .setTextSelection({
          from: position.value.from,
          to: position.value.from + linkText.value.length,
        })
        .setLink({ href: url.value })
        .run()
    } else {
      editor.value.chain().focus().setLink({ href: url.value }).run()
    }

    position.value = null
    editing.value = false
    linkText.value = undefined
    url.value = ''
  }

  function removeLink() {
    if (!editor.value) {
      return
    }

    if (!position.value) {
      return
    }
    editor.value
      .chain()
      .focus()
      .setTextSelection({
        from: position.value?.from,
        to: position.value?.to,
      })
      .unsetLink()
      .run()
    position.value = null
    editing.value = false
    linkText.value = undefined
    url.value = ''
  }

  watch(editing, (value) => {
    if (!value) {
      const currentPosition = editor.value?.state.selection
      if (currentPosition) {
        editor.value?.chain().focus().setTextSelection(currentPosition).run()
      }
      position.value = null
      url.value = ''
      linkText.value = undefined
    }
    updateDecoration()
  })

  const key = new PluginKey('persistentHover')

  onMounted(() => {
    editor.value?.registerPlugin(
      new Plugin({
        key: key,
        state: {
          init(_config, state) {
            return DecorationSet.create(state.doc, [])
          },
          apply(tr, oldState) {
            if (position.value && highlight) {
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
    editor.value?.unregisterPlugin(key)
  })

  return {
    editing,
    url,
    linkText,
    position,
    isNewLink,
    removeLink,
    setLink,
    initializeLinkEdit,
  }
}
