<script setup lang="ts">
import {
  useTemplateRef,
  ref,
  watch,
  onMounted,
  onUnmounted,
  computed,
} from 'vue'
import { useFloating } from '@floating-ui/vue'
import type { VirtualElement } from '@floating-ui/vue'
import { type Editor, posToDOMRect, type Range } from '@tiptap/vue-3'
import { onClickOutside, useMouseInElement, useMouse } from '@vueuse/core'
import { flip } from '@floating-ui/core'
const {
  editor,
  position,
  open,
  closeOnHover = true,
} = defineProps<{
  editor?: Editor
  position?: Range | null
  open: boolean
  closeOnHover?: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const anchor = ref<VirtualElement | null>(null)
const tooltip = useTemplateRef('tooltip')
const { floatingStyles } = useFloating(anchor, tooltip, {
  middleware: [flip()],
}) // TODO: allow middleware through props
const { x, y } = useMouse()
const isOutside = computed(() => {
  if (!anchor.value) return false
  const rect = anchor.value.getBoundingClientRect()
  const scrollY = window.scrollY || document.documentElement.scrollTop
  const scrollX = window.scrollX || document.documentElement.scrollLeft

  return (
    x.value < rect.x + scrollX ||
    x.value > rect.x + rect.width + scrollX ||
    y.value < rect.y + scrollY ||
    y.value > rect.y + rect.height + scrollY
  )
})
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
  anchor.value = {
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
      if (position) {
        return posToDOMRect(editor.view, position.from, position.to)
      }
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      } as DOMRect
    },
  }
}
watch(
  [() => editor?.state.selection, () => position],
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
  window.addEventListener('scroll', updateDOMReference)
  window.addEventListener('keydown', handleEscapeKey)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateDOMReference)
  window.removeEventListener('scroll', updateDOMReference)
  window.removeEventListener('keydown', handleEscapeKey)
})
</script>
<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="tooltip"
      :style="floatingStyles"
      v-bind="$attrs"
    >
      <slot />
    </div>
    <div
      v-else
      v-bind="$attrs"
    />
  </Teleport>
</template>
