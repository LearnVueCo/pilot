<script setup lang="ts" generic="T extends EditorCommand">
import type { EditorCommand } from '../utils/commands'
import { EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'
import { computed } from 'vue'
import CommandsRoot from './CommandsRoot.vue'
import type { EditorState } from '@tiptap/pm/state'

const props = defineProps<{
  editor?: Editor | null
  commands?: T[]
  disableBubbleMenu?: boolean
}>()

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
  const ignoreList = ['codeblock'] // TODO: Make convert this into a bubble menu computed property based on editor

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
    return props.commands ?? []
  }
  return props.commands?.filter(
    (c) => c.filter?.({ editor: props.editor! }) ?? true,
  )
})

function hideDragHandle() {
  const dragHandle = document.querySelector('.drag-handle')
  if (dragHandle) {
    dragHandle.classList.add('hide')
  }
}
</script>

<template>
  <div v-if="editor" @mouseleave="hideDragHandle">
    <slot name="header" :editor="editor" />

    <CommandsRoot
      v-if="filteredCommands"
      :editor="editor"
      :items="filteredCommands ?? []"
    >
      <template #commands="{ selectedIndex, selectItem, commands }">
        <slot
          name="commands"
          :editor="editor"
          :commands="commands"
          :selectedIndex="selectedIndex"
          :selectItem="selectItem"
        >
          Use the #commands slot to add commands UI
        </slot>
      </template>
    </CommandsRoot>

    <BubbleMenu
      v-if="!disableBubbleMenu"
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
