<script setup lang="ts" generic="T extends EditorCommand">
import type { EditorCommand } from '../utils/commands'
import { EditorContent, type Editor } from '@tiptap/vue-3'
import { provide } from 'vue'

const props = defineProps<{
  editor?: Editor | null
  commands?: T[]
}>()

provide('editor', () => props.editor)


function hideDragHandle() {
  const dragHandle = document.querySelector('.drag-handle')
  if (dragHandle) {
    dragHandle.classList.add('hide')
  }
}
</script>

<template>
  <div
    v-if="editor"
    @mouseleave="hideDragHandle"
  >
    <slot />
    <EditorContent :editor="editor" />
  </div>
</template>
