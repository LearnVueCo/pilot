<script setup lang="ts">
const { editor, commands } = useEditor({
  editor: {
    content: '<h1>Hello World</h1><p>This is a minimally styled editor.</p>',
  },
})

const defaultMode = ref(true)
function handleAnotherClick() {
  defaultMode.value = !defaultMode.value
}
</script>

<template>
  <Editor :editor="editor" :commands="commands">
    <BubbleMenu>
      <template #menu="{ editor, visible }">
        <Transition name="fade">
          <div v-if="visible">
            <div v-if="defaultMode" class="bubble-menu">
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

              <button @click="handleAnotherClick">s</button>
            </div>
            <div v-else>
              <input type="text" />
              <button @click="handleAnotherClick">switch</button>
            </div>
          </div>
        </Transition>
      </template>
    </BubbleMenu>
  </Editor>
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
