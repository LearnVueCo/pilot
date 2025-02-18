<script setup lang="ts">
import {
  useTemplateRef,
  ref,
  watch,
  onMounted,
  onUnmounted,
  computed,
} from 'vue'
import { useFloating, type VirtualElement } from '@floating-ui/vue'
import { Editor, posToDOMRect } from '@tiptap/vue-3'
import { onClickOutside, useMouseInElement } from '@vueuse/core'

const {
  editor,
  domReference,
  open,
  closeOnHover = true,
} = defineProps<{
  editor?: Editor
  domReference?: HTMLElement | null
  open: boolean
  closeOnHover?: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const reference = ref<HTMLElement | VirtualElement | null>(null)
const tooltip = useTemplateRef('tooltip')
const { floatingStyles } = useFloating(reference, tooltip) // TODO: allow middleware through props
const { isOutside } = useMouseInElement(domReference)
const { isOutside: isOutsideTooltip } = useMouseInElement(tooltip)

onClickOutside(tooltip, () => {
  emit('update:open', false)
})

const shouldClose = computed(() => {
  return isOutside.value && isOutsideTooltip.value
})

let timeout: NodeJS.Timeout | null = null

watch(shouldClose, (value) => {
  if (!closeOnHover) return
  if (value) {
    timeout = setTimeout(() => {
      emit('update:open', false)
    }, 500)
  } else {
    if (timeout) {
      clearTimeout(timeout)
    }
  }
})

function updateDOMReference() {
  if (timeout) {
    clearTimeout(timeout)
  }
  reference.value = domReference
    ? domReference
    : {
        getBoundingClientRect() {
          if (!editor) {
            return {
              width: 0,
              height: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            } as DOMRect
          }
          const middleTextPos =
            (editor.state.selection.$anchor.pos +
              editor.state.selection.$head.pos) /
            2
          return posToDOMRect(editor.view, middleTextPos, middleTextPos)
        },
      }
}
watch(
  [() => editor?.state.selection, () => domReference],
  () => {
    updateDOMReference()
  },
  { immediate: true },
)

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('update:open', false)
  }
}

// on dom resize, update the reference
onMounted(() => {
  window.addEventListener('resize', updateDOMReference)
  window.addEventListener('keydown', handleEscapeKey)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateDOMReference)
  window.removeEventListener('keydown', handleEscapeKey)
})
</script>
<template>
  <Teleport to="body">
    <div v-if="open" ref="tooltip" :style="floatingStyles" v-bind="$attrs">
      <slot />
    </div>
    <div v-else v-bind="$attrs"></div>
  </Teleport>
</template>
