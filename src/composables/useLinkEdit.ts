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
  const editor = editorRef
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
    const transaction = toValue(editor).state.tr.setMeta('run', 'run')
    toValue(editor).view.dispatch(transaction)
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
      (!toValue(editor).state.selection.empty &&
        toValue(editor).state.selection.from &&
        toValue(editor).state.selection.to)
    ) {
      position.value = pos ?? {
        from: toValue(editor).state.selection.from,
        to: toValue(editor).state.selection.to,
      }
      toValue(editor).chain().focus().setTextSelection(position.value).run()
      url.value = ''
      isNewLink.value = true
      if (toValue(editor).getAttributes('link').href) {
        url.value = toValue(editor).getAttributes('link').href
        linkText.value = toValue(editor).state.doc.textBetween(
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
      toValue(editor)
        .chain()
        .insertContentAt(position.value, linkText.value)
        .setTextSelection({
          from: position.value.from,
          to: position.value.from + linkText.value.length,
        })
        .setLink({ href: url.value })
        .run()
    } else {
      toValue(editor).chain().focus().setLink({ href: url.value }).run()
    }

    position.value = null
    editing.value = false
    linkText.value = undefined
    url.value = ''
  }

  function removeLink() {
    if (!toValue(editor)) {
      return
    }

    if (!position.value) {
      return
    }
    toValue(editor)
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
      const currentPosition = toValue(editor).state.selection
      if (currentPosition) {
        toValue(editor).chain().focus().setTextSelection(currentPosition).run()
      }
      position.value = null
      url.value = ''
      linkText.value = undefined
    }
    updateDecoration()
  })

  const key = new PluginKey('persistentHover')

  onMounted(() => {
    toValue(editor).registerPlugin(
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
    if (editor) {
      toValue(editor).unregisterPlugin(key)
    }
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
