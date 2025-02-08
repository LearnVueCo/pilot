<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
import Image from '@tiptap/extension-image'
import Command from '../extensions/command'
import suggestion from '../extensions/suggestion'

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading") {
          return `Heading ${node.attrs.level}`
        }
        return "Start typing, press '/' for commands"
      },
      includeChildren: true,

    }),
    GlobalDragHandle,
    Command.configure({
      suggestion,
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
  ],
  onPaste: (event, slice) => {
    console.log(event)
    // const items = (event.clipboardData || window.clipboardData).items

    const isImage = items.some((item) => item.type.indexOf('image') !== -1)
    console.log('isImage', isImage)

    if (isImage) {
      // event.preventDefault()
    }
  },
})
</script>

<template>
  <div style="min-height: 100vh">
    <editor-content :editor="editor" />
  </div>
</template>
