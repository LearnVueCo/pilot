<script setup lang="ts">
import { EditorContent, BubbleMenu, Editor, type Range } from '@tiptap/vue-3'
import { useEditor } from '../composables/useEditor'
import { ref, provide, computed } from 'vue'
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
    filter?: ({ editor }: { editor: Editor }) => boolean
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
  const ignoreList = ['codeblock', 'image'] // TODO: Make convert this into a bubble menu computed property based on editor

  if (ignoreList.includes(node.type.name.toLowerCase())) {
    return false
  }

  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i)
    if (ignoreList.includes(child.type.name.toLowerCase())) {
      return false
    }
  }
  return true
}

const filteredCommands = computed(() => {
  if (!props.editor) {
    return props.commands
  }
  return props.commands?.filter(
    (c) => c.filter?.({ editor: props.editor! }) ?? true,
  )
})
</script>

<template>
  <div>
    <slot name="header" :editor="editor" />
    <template v-if="showSuggestions">
      <Teleport to="#pencil-commands__root">
        <CommandsList
          :editor="editor"
          :items="filteredCommands ?? []"
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
