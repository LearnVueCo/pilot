import { type MaybeRefOrGetter, ref, toValue, watch } from 'vue'
import { Editor, type Range } from '@tiptap/vue-3'
import { useFakeHighlight } from '@learnvue/pilot'
type UseLinkEditOptions = {
  highlight?: boolean
  highlightClass?: string
}

export function useLinkEdit(
  editorRef: MaybeRefOrGetter<Editor | null | undefined>,
  options: UseLinkEditOptions = {},
) {
  const { highlight: shouldHighlight = true, highlightClass = 'bg-blue/50' } =
    options
  const editing = ref(false)

  const { highlight, unhighlight } = useFakeHighlight(editorRef, {
    highlightClass,
  })

  const url = ref('')
  const linkText = ref<string>()
  const isNewLink = ref(false)
  const position = ref<Range | null>(null)

  function initializeLinkEdit(pos?: Range) {
    const editor = toValue(editorRef)
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
      if (shouldHighlight) {
        highlight()
      }
      editing.value = true
    }
  }

  function setLink() {
    const editor = toValue(editorRef)
    if (!editor) {
      return
    }
    console.log(position.value)
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
    const editor = toValue(editorRef)
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
      const editor = toValue(editorRef)
      if (!editor) {
        return
      }
      const currentPosition = editor.state.selection
      if (currentPosition) {
        editor.chain().focus().setTextSelection(currentPosition).run()
      }
      position.value = null
      url.value = ''
      linkText.value = undefined
      if (shouldHighlight) {
        unhighlight()
      }
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