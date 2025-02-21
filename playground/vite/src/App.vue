<script setup lang="ts">
import { useEditor, Editor } from '@learnvue/pencil'
import { EditorExtensions } from '@learnvue/pencil/extensions'

const { editor, commands } = useEditor({
  editor: {
    content: '<h1>Hello World</h1><p>This is a minimally styled editor.</p>',
  },
  extensions: [
    ...EditorExtensions({
      starterKit: {
        heading: {
          levels: [1, 2, 3, 4],
        },
      },
    }),
  ],
})
</script>

<template>
  <div style="height: 100vh; width: 100vw">
    <Editor :editor="editor" :commands="commands" :style="{}">
      <template #commands="{ commands, selectedIndex, selectItem }">
        <button
          v-for="(command, index) in commands"
          :key="index"
          :class="{ 'is-active': selectedIndex === index }"
          @click="selectItem(index)"
        >
          {{ command.label }}
        </button>
      </template>
    </Editor>
  </div>
</template>
