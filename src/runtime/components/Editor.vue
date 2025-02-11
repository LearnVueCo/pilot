<script setup lang="ts">
import { EditorContent, BubbleMenu, Editor, type Range } from '@tiptap/vue-3'
import { useEditor } from '../composables/useEditor'
import { ref, provide } from 'vue'
import CommandsList from './CommandsList.vue'
import type { EditorState } from '@tiptap/pm/state'

const props = defineProps<{
  editor?: Editor
  commands?: {
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
  disableBubbleMenu?: boolean
}>()

const editor =
  props.editor! ??
  useEditor({
    content: '<h1>Hello World</h1>',
  })!

const showSuggestions = ref(false)

provide('showSuggestions', showSuggestions)

const suggestionsState = ref<{
  range: Range | null
  query: string
}>({
  range: null,
  query: '',
})

provide('suggestionsState', suggestionsState)

function shouldShow(props: { state: EditorState }) {
  if (!props.state?.selection) {
    return false
  }
  if (props.state.selection.empty) {
    return false
  }
  const from = props.state.selection.from
  const pos = props.state.doc.resolve(from)
  const node = pos.node()

  if (node.type.name.toLowerCase() === 'codeblock') {
    return false
  }
  return true
}
</script>

<template>
  <div>
    <slot name="header" :editor="editor" />
    <template v-if="showSuggestions">
      <Teleport to="#pencil-commands__root">
        <CommandsList
          :editor="editor"
          :items="commands ?? []"
          v-slot="{ selectedIndex, selectItem, filteredItems }"
        >
          <slot
            name="suggestions"
            :editor="editor"
            :suggestions="filteredItems"
            :selectedIndex="selectedIndex"
            :selectItem="selectItem"
          >
            Use the #suggestions slot to add suggestions.
          </slot>
        </CommandsList>
      </Teleport>
    </template>
    <BubbleMenu
      v-if="editor && !disableBubbleMenu"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      :shouldShow="({ state }) => shouldShow({ state })"
    >
      <slot name="menu" :editor="editor">
        <div class="bubble-menu">
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            Bold
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            Italic
          </button>
          <button
            @click="editor.chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
          >
            Strike
          </button>
        </div>
      </slot>
    </BubbleMenu>
    <EditorContent :editor="editor" />
  </div>
</template>
