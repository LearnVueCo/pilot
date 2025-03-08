<script setup lang="ts">
// Adapted from https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bubble-menu/src/bubble-menu-plugin.ts#L80

import { isTextSelection } from '@tiptap/core'
import type { Editor, Range } from '@tiptap/vue-3'
import { posToDOMRect } from '@tiptap/vue-3'
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  toValue,
  type MaybeRef,
  nextTick,
  watch,
} from 'vue'
import { Plugin, PluginKey, type Selection } from '@tiptap/pm/state'
import { type VirtualElement, useFloating, shift } from '@floating-ui/vue'
import { EditorView } from '@tiptap/pm/view'

const { delay = 350 } = defineProps<{
  delay?: number
}>()
const emit = defineEmits<{
  close: []
}>()

const injectedEditor = inject<MaybeRef<Editor | null>>('editor')

const editor = toValue(injectedEditor)

const isVisible = ref(false)
const menu = useTemplateRef('menu')
const selectedRange = ref<Range | null>(null)
const preventHide = ref(false)
const pluginKey = new PluginKey('lv-bubble-menu')

const referenceEl = computed<VirtualElement | null>(() => {
  const range = toValue(selectedRange)
  if (!range || !editor) {
    return null
  }
  return {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        range.from,
        range.to,
      ),
  }
})

watch(isVisible, (value) => {
  if (!value) {
    emit('close')
  }
})

function shouldShowMenu({ editor }: { editor?: Editor | null }) {
  if (!editor) {
    return false
  }
  const { state } = editor.view
  const { selection, doc } = state

  const isEmptyTextBlock =
    !doc.textBetween(selection.from, selection.to).length &&
    isTextSelection(state.selection)

  const hasFocus =
    editor.isFocused ||
    menu.value?.contains(document.activeElement) ||
    focusin.value

  if (selection.empty || isEmptyTextBlock || !hasFocus || !editor.isEditable) {
    return false
  }
  return true
}

const { floatingStyles } = useFloating(referenceEl, menu, {
  placement: 'top',
  middleware: [shift()],
})

let timeout: NodeJS.Timeout | null = null
let previousSelection: Selection | null = null
function handleUpdate(view: EditorView) {
  const { state, composing } = view
  if (state.selection.empty) {
    isVisible.value = false
    return
  }

  // don't show the menu while someone is still dragging a selection
  if (
    previousSelection?.from !== state.selection?.from ||
    previousSelection?.to !== state.selection?.to
  ) {
    isVisible.value = false
    if (timeout) {
      clearTimeout(timeout)
    }
  }
  previousSelection = state.selection

  if (timeout) {
    clearTimeout(timeout)
  }

  timeout = setTimeout(() => {
    if (composing) {
      return
    }

    if (!shouldShowMenu({ editor: editor })) {
      isVisible.value = false
      return
    }

    isVisible.value = true
    selectedRange.value = state.selection
  }, delay)
}
onMounted(() => {
  if (!editor) {
    return
  }
  editor.on('blur', ({ event }) => {
    // If the menu is has been clicked, don't hide it
    if (preventHide.value) {
      preventHide.value = false
      return
    }

    if (menu.value?.contains(event.relatedTarget as Node)) {
      return
    }

    isVisible.value = false
  })

  editor.registerPlugin(
    new Plugin({
      key: pluginKey,
      view: (_view) => {
        return {
          update: (view) => {
            handleUpdate(view)
          },
        }
      },
    }),
  )
  setTimeout(() => {
    // debugger;
  }, 5000)
})

onBeforeUnmount(() => {
  if (!editor) {
    return
  }
  editor.unregisterPlugin(pluginKey)
})

function handleMousedown(_event: MouseEvent) {
  preventHide.value = true
}

const focusin = ref(false)
function handleFocusin(_event: FocusEvent) {
  focusin.value = true
}

async function handleFocusout(event: FocusEvent) {
  if (!editor) {
    return
  }
  // wait to see if the item is still in the menu
  await nextTick()
  if (menu.value?.contains(event.target as Node)) {
    focusin.value = false
  }
  handleUpdate(editor.view)
}
</script>

<template>
  <div
    v-if="editor && isVisible"
    ref="menu"
    class="bubble-menu"
    :style="floatingStyles"
    style="z-index: 50"
    :data-state="isVisible ? 'open' : 'closed'"
    @mousedown.capture="handleMousedown"
    @focusin="handleFocusin"
    @focusout="handleFocusout"
  >
    <slot :editor="editor">
      <button
        style="cursor: pointer"
        @click="editor.chain().focus().toggleBold().run()"
      >
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()">
        Italic
      </button>
    </slot>
  </div>
</template>
