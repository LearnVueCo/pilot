<script setup lang="ts">
import { type Editor, type Range } from '@tiptap/vue-3'

const {
  content = '<h1>Example Heading</h1><p>This is an example paragraph.</p>',
  bubbleMenu = true,
  transitionBubbleMenu = false,
  notProse = false,
  showInput = false,
  fakeHighlight = false,
} = defineProps<{
  content?: string
  bubbleMenu?: boolean
  transitionBubbleMenu?: boolean
  notProse?: boolean
  showInput?: boolean
  fakeHighlight?: boolean
}>()

const { editor } = useEditor({
  editor: {
    content: content,
  },
})

const { highlight, unhighlight } = useFakeHighlight(editor, {
  highlightClass: 'bg-blue-400/40 py-[2.5px]',
})

function tryHighlight() {
  if (fakeHighlight) {
    highlight()
  }
}

function tryUnhighlight() {
  if (fakeHighlight) {
    unhighlight()
  }
}
</script>

<template>
  <div class="dropped mt-8 mb-12 flex flex-col">
    <div
      class="relative w-full border border-b-0 border-[var(--ui-border)] bg-[var(--ui-primary-300)] px-6 py-2 font-bold text-[var(--ui-primary-900)]"
    >
      Try it
    </div>
    <div
      class="relative w-full flex-1 overflow-y-auto border border-[var(--ui-border)] bg-[var(--ui-bg)] p-8"
    >
      <ClientOnly>
        <Editor
          v-if="editor"
          :editor="editor"
          :commands="[]"
          aria-label="Rich text editor"
          class="h-full"
          :class="{
            'not-prose': notProse,
          }"
        >
          <BubbleMenu v-if="bubbleMenu" @close="tryUnhighlight">
            <template v-if="transitionBubbleMenu" #menu="{ editor, visible }">
              <Transition
                :name="transitionBubbleMenu ? 'fade' : undefined"
                appear
              >
                <div v-if="visible">
                  <div v-if="showInput" class="flex items-center">
                    <UInput
                      placeholder="Edit with AI"
                      @focus="tryHighlight"
                      :ui="{
                        root: '!border-r-0',
                        base: 'rounded-r-none outline-0',
                      }"
                    />
                    <UButton
                      icon="i-ri:sparkling-2-fill"
                      class="rounded-l-none"
                    />
                  </div>
                  <UButtonGroup
                    v-else
                    class="rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-accented)]"
                  >
                    <UButton
                      @click="editor?.chain().focus().toggleBold().run()"
                      size="sm"
                      variant="ghost"
                      color="neutral"
                      :class="{
                        'bg-white/20': editor.isActive('bold'),
                      }"
                      icon="i-ri:bold"
                    />
                    <UButton
                      @click="editor?.chain().focus().toggleItalic().run()"
                      size="sm"
                      variant="ghost"
                      color="neutral"
                      :class="{
                        'bg-white/20': editor.isActive('italic'),
                      }"
                      icon="i-ri:italic"
                    />
                  </UButtonGroup>
                </div>
              </Transition>
            </template>
            <div>
              <div v-if="showInput" class="flex items-center">
                <UInput
                  placeholder="Edit with AI"
                  @focus="tryHighlight"
                  :ui="{
                    root: '!border-r-0',
                    base: 'rounded-r-none outline-0',
                  }"
                />
                <UButton icon="i-ri:sparkling-2-fill" class="rounded-l-none" />
              </div>
              <UButtonGroup
                v-else
                class="rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-accented)]"
              >
                <UButton
                  @click="editor?.chain().focus().toggleBold().run()"
                  size="sm"
                  variant="ghost"
                  color="neutral"
                  :class="{
                    'bg-white/20': editor.isActive('bold'),
                  }"
                  icon="i-ri:bold"
                />
                <UButton
                  @click="editor?.chain().focus().toggleItalic().run()"
                  size="sm"
                  variant="ghost"
                  color="neutral"
                  :class="{
                    'bg-white/20': editor.isActive('italic'),
                  }"
                  icon="i-ri:italic"
                />
              </UButtonGroup>
            </div>
          </BubbleMenu>
        </Editor>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  scale: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: 0.9;
}
</style>
