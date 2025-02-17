<template>
  <div id="pencil-commands__root" class="dropdown-menu"></div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onBeforeMount,
  onUnmounted,
  inject,
  type Ref,
  watchEffect,
} from 'vue'
import type { Range } from '@tiptap/vue-3'

const showCommands = inject<Ref<boolean>>('showCommands')
const commandsState = inject<
  Ref<{
    range: Range | null
    query: string
  }>
>('commandsState')

const props = defineProps<{
  range: Range
  query: string
}>()

onBeforeMount(() => {
  if (showCommands) {
    showCommands.value = true
  }
})

onUnmounted(() => {
  if (showCommands) {
    showCommands.value = false
  }
})

watchEffect(() => {
  if (!commandsState) {
    return
  }
  commandsState.value = {
    range: props.range,
    query: props.query,
  }
})

function onKeyDown({ event }: { event: KeyboardEvent }): boolean {
  const el = document.querySelector('#pencil-commands__list')
  if (el) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: event.key }))
  }

  if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
    return true
  }
  return false
}

defineExpose({
  onKeyDown, // needed to be able to pass events from suggestion.ts plugin
})
</script>
