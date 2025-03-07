<script setup lang="ts">
import { EditorExtensions } from '../../src/extensions'
const { editor } = useEditor({
  editor: {
    content: "<h1>Hello World</h1><p>This is a minimally styled editor.</p>",
  },
  extensions: [
    ...EditorExtensions(),
  ],
});

const defaultMode = ref(true);
function handleAnotherClick() {
  highlight();
  defaultMode.value = !defaultMode.value;
}

const { highlight, unhighlight } = useFakeHighlight(editor, {
  highlightClass: "bg-red",
});

const commands = ref([
  {
    id: 'h1',
    label: 'Heading 1',
    command: commandActions.h1,
    icon: 'i-ri:heading',
    altNames: ['h1'],
  },
  {
    id: 'h2',
    label: 'Heading 2',
    command: commandActions.h2,
    icon: 'i-ri:heading',
    altNames: ['h2'],
  },
])
</script>

<template>
  <div class="max-w-3xl mx-auto mt-16">
    <Editor
      :editor="editor"
      @keydown.esc="highlight()"
      @click.middle="unhighlight()"
    >
      <Commands :commands="commands">
        <template #default="{ commands, selectedIndex, selectItem }">
          <div style="display: flex;  flex-direction: column;">
            <button
              v-for="command, index in commands"
              :key="command.id"
              :style="{
                backgroundColor: selectedIndex === index ? 'blue' : 'transparent',
              }"
              @click="selectItem(index)"
            >
              {{ command.label }}
            </button>
          </div>
        </template>
      </Commands>
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
  </div>
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

.bg-red {
  background: rgba(226, 35, 35, 0.28);
}
</style>
