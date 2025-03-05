<script setup lang="ts" generic="T extends EditorCommand">
import type { Editor, Range } from '@tiptap/vue-3'
import { ref, type Ref } from 'vue'
import type { EditorCommand } from '../utils/commands'

const props = defineProps<{
  editor: Editor
  items: T[]
  range: Range | null
  query: string
}>()

const selectedIndex = ref(0)

function onKeyDown(event: KeyboardEvent): boolean {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

function upHandler(): void {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length
}

function downHandler(): void {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

function enterHandler(): void {
  selectItem(selectedIndex.value)
}

function selectItem(index: number): void {
  const item = props.items[index]
  if (item && props.range) {
    item.command({ editor: props.editor, range: props.range })
  }
}
</script>

<template>
  <div id="pilor-commands__list" @keydown="onKeyDown">
    <slot
      :selectedIndex="selectedIndex"
      :selectItem="selectItem"
      :filteredItems="items"
    />
  </div>
</template>
