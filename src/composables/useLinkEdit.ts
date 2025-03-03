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
import { useFakeHighlight } from './useFakeHighlight'
type UseLinkEditOptions = {
  highlight?: boolean
  highlightClass?: string
}

export function useLinkEdit(
  editorRef: MaybeRefOrGetter<Editor | null | undefined>,
  options: UseLinkEditOptions = {},
) {
  const editor = editorRef
  const { highlight: shouldHighlight = true, highlightClass = 'bg-blue/50' } =
    options
  const editing = ref(false)

  const { highlight, unhighlight } = useFakeHighlight(editor, {
    highlightClass,
  })

  const url = ref('')
  const linkText = ref<string>()
  const isNewLink = ref(false)
  const position = ref<Range | null>(null)

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
      if (shouldHighlight) {
        highlight(position.value)
      }
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
    if (shouldHighlight) {
      unhighlight()
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
