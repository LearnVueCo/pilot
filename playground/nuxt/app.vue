<script setup lang="ts">
const { editor, commands } = useEditor({
  editor: {
    content: '<h1>Hello World</h1><p>This is a minimally styled editor.</p>',
  },
})
</script>

<template>
  <Editor :editor="editor" :commands="commands" />
</template>
