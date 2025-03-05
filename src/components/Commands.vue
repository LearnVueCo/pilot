<script setup lang="ts" generic="T extends EditorCommand">
import {
  ref,
  onBeforeMount,
  onUnmounted,
  computed,
  watch,
  inject,
  toValue,
  type MaybeRef,
} from 'vue'
import type { Editor, Range } from '@tiptap/vue-3'
import type { SuggestionKeyDownProps } from '@tiptap/suggestion'
import {
  flip,
  offset,
  shift,
  useFloating,
  type VirtualElement,
} from '@floating-ui/vue'
import type { EditorCommand } from '../utils/commands'
import { Transaction } from '@tiptap/pm/state'

const props = defineProps<{
  commands?: T[]
}>()

const reference = ref<VirtualElement | null>(null)
const floating = ref<HTMLElement | null>(null)

// TODO: Make this prop-configurable
const { x, y, strategy, update } = useFloating(reference, floating, {
  placement: 'bottom-start',
  middleware: [offset(6), flip(), shift()],
})

const injectedEditor = inject<MaybeRef<Editor | null>>('editor')

const editor = toValue(injectedEditor)

const position = ref({
  active: false,
})

const query = ref('')
const range = ref<Range | null>(null)

const filteredItems = computed(() => {
  return (props.commands ?? []).filter(
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
  editor?.on('transaction', onTransaction)

  editor?.on('transaction', onSuggestionKeyDown)
})

onUnmounted(() => {
  if (position.value.active) {
    position.value.active = false
  }

  editor?.off('transaction', onTransaction)
  editor?.off('transaction', onSuggestionKeyDown)
})

const selectedIndex = ref(0)

function onKeyDown({ event }: { event: KeyboardEvent }): boolean {
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

function upHandler() {
  if (!props.commands?.length) {
    return
  }

  selectedIndex.value =
    (selectedIndex.value + props.commands.length - 1) % props.commands.length
}

function downHandler() {
  if (!props.commands?.length) {
    return
  }

  selectedIndex.value = (selectedIndex.value + 1) % props.commands.length
}

function enterHandler() {
  if (!props.commands?.length) {
    return
  }

  selectItem(selectedIndex.value)
}

function selectItem(index: number) {
  if (!props.commands || !editor) {
    return
  }
  const item = props.commands[index]
  if (item && range.value) {
    item.command({ editor: editor, range: range.value })
  }
}
</script>

<template>
  <div
    v-if="position.active"
    id="pilot-commands__root"
    ref="floating"
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
    <slot
      :editor="editor"
      :commands="filteredItems"
      :selected-index="selectedIndex"
      :select-item="selectItem"
    />
  </div>
</template>
