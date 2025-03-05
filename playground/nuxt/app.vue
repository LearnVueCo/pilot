<script setup lang="ts">
const { editor, commands } = useEditor({
  editor: {
    content: "<h1>Hello World</h1><p>This is a minimally styled editor.</p>",
  },
});

const defaultMode = ref(true);
function handleAnotherClick() {
  highlight();
  defaultMode.value = !defaultMode.value;
}

const { highlight, unhighlight } = useFakeHighlight(editor, {
  highlightClass: "bg-blue",
});
</script>

<template>
  <Editor
    :editor="editor"
    :commands="commands"
    @keydown.esc="highlight()"
    @click.middle="unhighlight()"
  >
    <BubbleMenu
      v-if="editor"
      @close="unhighlight()"
    >
      <template #menu="{ visible }">
        <Transition name="fade">
          <div v-if="visible">
            <div
              v-if="defaultMode"
              class="bubble-menu"
            >
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

              <button @click="handleAnotherClick">
                s
              </button>
            </div>
            <div v-else>
              <input
                type="text"
                @focus="highlight()"
              >
              <button @click="handleAnotherClick">
                switch
              </button>
            </div>
          </div>
        </Transition>
      </template>
    </BubbleMenu>
  </Editor>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: 0.9;
}

.bg-blue {
  background: rgba(226, 35, 35, 0.28);
}
</style>
