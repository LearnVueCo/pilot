<script setup lang="ts">
import { usePilot, Editor, BubbleMenu } from '@learnvue/pilot'
import { EditorExtensions } from '@learnvue/pilot/extensions'

const { editor, commands } = usePilot({
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
    <Editor
      :editor="editor"
      :commands="commands"
      :style="{}"
    >
      <BubbleMenu>
        <template
          v-if="editor"
          #menu="{ visible }"
        >
          <Transition name="fade">
            <div v-if="visible">
              <button
                :class="{ 'is-active': editor.isActive('bold') }"
                @click="editor.chain().focus().toggleBold().run()"
              >
                Bold
              </button>
              <button
                :class="{ 'is-active': editor.isActive('italic') }"
                @click="editor.chain().focus().toggleItalic().run()"
              >
                Italic
              </button>
              <button
                :class="{ 'is-active': editor.isActive('strike') }"
                @click="editor.chain().focus().toggleStrike().run()"
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
