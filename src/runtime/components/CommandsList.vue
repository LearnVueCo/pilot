<script setup lang="ts">
import type { Editor, Range } from '@tiptap/vue-3'
import { ref, inject, type Ref, computed } from 'vue'

const props = defineProps<{
  editor: Editor
  items: {
    title: string
    command: ({
      editor,
      range,
    }: {
      editor: Editor
      range: Range | null
    }) => void
    class?: string
    icon?: string
  }[]
}>()

const selectedIndex = ref(0)
const suggestionsState = inject<
  Ref<{
    range: Range | null
    query: string
  }>
>('suggestionsState')

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
  const item = filteredItems.value[index]
  if (item && suggestionsState) {
    item.command({ editor: props.editor, range: suggestionsState.value.range })
  }
}

const filteredItems = computed(() => {
  return props.items.filter(
    (item) =>
      !suggestionsState?.value.query.length ||
      item.title
        .toLowerCase()
        .startsWith(suggestionsState?.value.query.toLowerCase()),
  )
})
</script>

<template>
  <div id="pencil-commands__list" @keydown="onKeyDown">
    <slot
      :selectedIndex="selectedIndex"
      :selectItem="selectItem"
      :filteredItems="filteredItems"
    />
  </div>
</template>
