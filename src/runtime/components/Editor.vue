<script setup lang="ts">
import { EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'
import { useEditor } from '../composables/useEditor'

const props = defineProps<{
  editor?: Editor
}>()

const editor =
  props.editor ??
  useEditor({
    content: '<h1>Hello World</h1>',
  })
</script>

<template>
  <div>
    <slot name="header" :editor="editor" />
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
