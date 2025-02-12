<script setup lang="ts">
import { type Editor, type Range } from '@tiptap/vue-3'
const editor = useEditor({
  content: '<h1></h1>',
})

const suggestions: {
  title: string
  command: ({ editor, range }: { editor: Editor; range: Range | null }) => void
  class?: string
  icon?: string
  badge?:
    | string
    | { label: string; class: string; variant: string; color: string }
  filter?: ({ editor }: { editor: Editor }) => boolean
}[] = [
  {
    title: 'Heading 1',
    command: ({ editor, range }) => {
      if (!range) {
        return
      }
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    },
    icon: 'i-ri:h-1',
    filter: ({ editor }) => {
      return true
    },
  },
  {
    title: 'Heading 2',
    command: ({ editor, range }) => {
      if (!range) {
        return
      }
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
    icon: 'i-ri:h-2',
  },
  {
    title: 'Heading 3',
    command: ({ editor, range }) => {
      if (!range) {
        return
      }
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
    icon: 'i-ri:h-3',
  },
  {
    title: 'Bold',
    command: ({ editor, range }) => {
      if (!range) {
        return
      }
      editor.chain().focus().deleteRange(range).setMark('bold').run()
    },
    class: 'font-bold',
    icon: 'i-ri:bold',
  },
  {
    title: 'Italic',
    command: ({ editor, range }) => {
      if (!range) {
        return
      }
      editor.chain().focus().deleteRange(range).setMark('italic').run()
    },
    class: 'italic',
    icon: 'i-ri:italic',
  },
  {
    title: 'Divider',
    command: ({ editor, range }) => {
      if (!range) {
        return
      }

      editor.chain().deleteRange(range).run()
      editor.chain().setHorizontalRule().run()
    },
    icon: 'ic:baseline-horizontal-rule',
  },
]
</script>

<template>
  <div class="mx-auto max-w-3xl rounded border border-[var(--ui-border)] p-8">
    <ClientOnly>
      <Editor :editor="editor" :commands="suggestions">
        <template #suggestions="{ suggestions, selectedIndex, selectItem }">
          <UButtonGroup
            orientation="vertical"
            class="rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-accented)]"
          >
            <UButton
              v-for="(item, index) in suggestions"
              :key="index"
              variant="ghost"
              color="neutral"
              :class="{
                'bg-white/10': index === selectedIndex,
                [item.class ?? '']: true,
              }"
              :ui="{
                base: 'hover:!bg-white/10',
              }"
              :leading-icon="item.icon"
              @click="selectItem(index)"
            >
              {{ item.title }}
            </UButton>
          </UButtonGroup>
        </template>
      </Editor>
    </ClientOnly>
  </div>
</template>
