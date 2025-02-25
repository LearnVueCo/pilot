import {
  MaybeRefOrGetter,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type Ref,
} from 'vue'
import { Editor, type Range } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
type UseLinkEditOptions = {
  highlight?: boolean
  highlightClass?: string
}

export function useLinkEdit(
  editorRef: MaybeRefOrGetter<Editor | null | undefined>,
  options: UseLinkEditOptions = {},
) {
  const editor = toValue(editorRef)
  const { highlight = true, highlightClass = 'bg-blue/50' } = options

  const position = ref<Range | null>(null)
  const editing = ref(false)
  const url = ref('')
  const linkText = ref<string>()
  const isNewLink = ref(false)

  function updateDecoration() {
    if (!editor || !highlight) {
      return
    }
    const transaction = editor.state.tr.setMeta('run', 'run')
    editor.view.dispatch(transaction)
  }

  function initializeLinkEdit(pos?: Range) {
    if (!editor) {
      return
    }
    if (pos && (pos.from < 0 || pos.to < pos.from)) {
      console.warn('Invalid position range provided')
      return
    }
    if (
      pos ||
      (!editor.state.selection.empty &&
        editor.state.selection.from &&
        editor.state.selection.to)
    ) {
      position.value = pos ?? {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      }

      editor.chain().focus().setTextSelection(position.value).run()
      url.value = ''
      isNewLink.value = true
      if (editor.getAttributes('link').href) {
        url.value = editor.getAttributes('link').href
        linkText.value = editor.state.doc.textBetween(
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
    if (!editor) {
      return
    }
    if (!position.value) {
      editing.value = false
      return
    }
    if (linkText.value) {
      editor
        .chain()
        .insertContentAt(position.value, linkText.value)
        .setTextSelection({
          from: position.value.from,
          to: position.value.from + linkText.value.length,
        })
        .setLink({ href: url.value })
        .run()
    } else {
      editor.chain().focus().setLink({ href: url.value }).run()
    }

    position.value = null
    editing.value = false
    linkText.value = undefined
    url.value = ''
  }

  function removeLink() {
    if (!editor) {
      return
    }

    if (!position.value) {
      return
    }
    editor
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
      const currentPosition = editor.state.selection
      if (currentPosition) {
        editor.chain().focus().setTextSelection(currentPosition).run()
      }
      position.value = null
      url.value = ''
      linkText.value = undefined
    }
    updateDecoration()
  })

  const key = new PluginKey('persistentHover')

  onMounted(() => {
    editor.registerPlugin(
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
    editor.unregisterPlugin(key)
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
