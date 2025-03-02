<script setup lang="ts">
import { useEditor, Editor, BubbleMenu } from '@learnvue/pencil'
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
      <BubbleMenu>
        <template #menu="{ editor, visible }">
          <Transition name="fade">
            <div v-if="visible">
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
              <button>s</button>
              <button>s</button>
              <button>s</button>
            </div>
          </Transition>
        </template>
      </BubbleMenu>
    </Editor>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: 0.9;
}
</style>
