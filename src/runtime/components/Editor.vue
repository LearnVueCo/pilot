<script setup lang="ts">
import { EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'
import { useEditor } from '../composables/useEditor'
import { ref, provide } from 'vue'
import type Suggestion from '@tiptap/suggestion'

const props = defineProps<{
  editor?: Editor
  commands: Partial<typeof Suggestion>[]
}>()

const editor =
  props.editor ??
  useEditor({
    content: '<h1>Hello World</h1>',
  })

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
</script>

<template>
  <div>
    <slot name="header" :editor="editor" />
    <template v-if="showSuggestions">
      <Teleport to="#pencil-commands__root">
        <CommandsList
          :editor="editor"
          :items="commands"
          v-slot="{ selectedIndex, selectItem }"
        >
          <slot
            name="suggestions"
            :editor="editor"
            :suggestions="commands"
            :selectedIndex="selectedIndex"
            :selectItem="selectItem"
          />
        </CommandsList>
      </Teleport>
    </template>
    <BubbleMenu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
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
