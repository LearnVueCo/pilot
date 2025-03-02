<script setup lang="ts" generic="T extends EditorCommand">
import { ref, onBeforeMount, onUnmounted, computed, watch } from 'vue'
import type { Editor, Range } from '@tiptap/vue-3'
import CommandsList from './CommandsList.vue'
import { SuggestionKeyDownProps } from '@tiptap/suggestion'
import {
  flip,
  offset,
  shift,
  useFloating,
  VirtualElement,
} from '@floating-ui/vue'
import type { EditorCommand } from '../utils/commands'
import { Transaction } from '@tiptap/pm/state'

const props = defineProps<{
  editor: Editor
  items?: T[]
}>()

// Floating UI refs
const reference = ref<VirtualElement | null>(null)
const floating = ref<HTMLElement | null>(null)

// Setup floating UI
const { x, y, strategy, update } = useFloating(reference, floating, {
  placement: 'bottom-start',
  middleware: [
    offset(6), // Add 6px offset from the reference
    flip(), // Flip to opposite side if no space
    shift(), // Shift horizontally if needed
  ],
})

// Add positioning state
const position = ref({
  active: false,
})

const query = ref('')
const range = ref<Range | null>(null)

const filteredItems = computed(() => {
  return (props.items ?? []).filter(
    (item) =>
      !query.value.length ||
      item.label.toLowerCase().startsWith(query.value.toLowerCase()) ||
      item.altNames?.some((altName) =>
        altName.toLowerCase().startsWith(query.value.toLowerCase()),
      ),
  )
})

watch(filteredItems, () => {
  update()
})

function onTransaction({ transaction }: { transaction: Transaction }) {
  const suggestionMeta = transaction.getMeta('suggestionProps')
  if (suggestionMeta) {
    if (!suggestionMeta.active) {
      position.value.active = false
      return
    }

    position.value.active = true

    const rect = suggestionMeta.clientRect()
    reference.value = {
      getBoundingClientRect() {
        return rect
      },
    }
    update()
    range.value = suggestionMeta.props.range
    query.value = suggestionMeta.props.query
  }
}

function onSuggestionKeyDown({ transaction }: { transaction: Transaction }) {
  const suggestionKeyDown: SuggestionKeyDownProps =
    transaction.getMeta('suggestionKeyDown')
  if (suggestionKeyDown) {
    onKeyDown(suggestionKeyDown)
  }
}

// Watch for suggestion updates from the editor
onBeforeMount(() => {
  props.editor?.on('transaction', onTransaction)

  props.editor?.on('transaction', onSuggestionKeyDown)
})

onUnmounted(() => {
  if (position.value.active) {
    position.value.active = false
  }

  props.editor?.off('transaction', onTransaction)
  props.editor?.off('transaction', onSuggestionKeyDown)
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
</script>

<template>
  <div
    v-if="position.active"
    ref="floating"
    id="pencil-commands__root"
    class="dropdown-menu"
    :style="{
      position: strategy,
      top: '0',
      left: '0',
      transform: `translate(${x ?? 0}px, ${y ?? 0}px)`,
      display: position.active ? 'block' : 'none',
      zIndex: 100,
    }"
  >
    <CommandsList
      v-if="position.active"
      :editor="editor"
      :items="filteredItems"
      :range="range"
      :query="query"
      v-slot="{ selectedIndex, selectItem }"
    >
      <slot
        name="commands"
        :editor="editor"
        :commands="filteredItems"
        :selectedIndex="selectedIndex"
        :selectItem="selectItem"
      >
        <!-- Default commands UI -->
        <div class="commands-list">
          <button
            v-for="(item, index) in filteredItems"
            :key="index"
            :class="{ 'is-selected': index === selectedIndex }"
            @click="selectItem(index)"
          >
            {{ item.label }}
          </button>
        </div>
      </slot>
    </CommandsList>
  </div>
</template>
