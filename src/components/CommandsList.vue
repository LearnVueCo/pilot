<script setup lang="ts" generic="T extends EditorCommand">
import type { Editor, Range } from '@tiptap/vue-3'
import { ref, inject, type Ref, computed, watch } from 'vue'
import type { EditorCommand } from '../utils/commands'

const props = defineProps<{
  editor: Editor
  items: T[]
}>()

const selectedIndex = ref(0)
const commandsState = inject<
  Ref<{
    range: Range | null
    query: string
  }>
>('commandsState')

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
  if (item && commandsState) {
    if (!commandsState.value.range) {
      return
    }
    item.command({ editor: props.editor, range: commandsState.value.range })
  }
}

const filteredItems = computed(() => {
  return props.items.filter(
    (item) =>
      !commandsState?.value.query.length ||
      item.label
        .toLowerCase()
        .startsWith(commandsState?.value.query.toLowerCase()) ||
      item.altNames?.some((altName) =>
        altName
          .toLowerCase()
          .startsWith(commandsState?.value.query.toLowerCase()),
      ),
  )
})

watch(filteredItems, () => {
  selectedIndex.value = 0
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
