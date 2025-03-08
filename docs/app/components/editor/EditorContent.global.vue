<script setup lang="ts">
import { EditorExtensions, usePilot, useFakeHighlight, commandActions } from '@learnvue/pilot'

const {
  content = '<h1>Example Heading</h1><p>This is an example paragraph.</p>',
  bubbleMenu = true,
  transitionBubbleMenu = false,
  notProse = false,
  showInput = false,
  fakeHighlight = false,
  showCommands = false,
} = defineProps<{
  content?: string
  bubbleMenu?: boolean
  transitionBubbleMenu?: boolean
  notProse?: boolean
  showInput?: boolean
  fakeHighlight?: boolean
  showCommands?: boolean
}>()

function getContent() {
  try {
    return JSON.parse(content)
  } catch (_error) {
    return content
  }
}

const { editor } = usePilot({
  editor: {
    content: getContent(),
  },
  extensions: [
    ...EditorExtensions(),
  ],
})

const commands = [
  {
    id: 'bold',
    label: 'Bold',
    command: commandActions.bold,
  },
  {
    id: 'italic',
    label: 'Italic',
    command: commandActions.italic,
  },
  {
    id: 'divider',
    label: 'Divider',
    command: commandActions.divider,
  },
  {
    id: 'unorderedList',
    label: 'Unordered List',
    command: commandActions.unorderedList,
  },
  {
    id: 'orderedList',
    label: 'Ordered List',
    command: commandActions.orderedList,
  },
]

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

function copyContent() {
  navigator.clipboard.writeText(JSON.stringify(editor.value?.getJSON()).replace(/'/g, '\\"'))
}

const link = ref('')
function addLink() {
  editor.value?.chain().focus().setLink({ href: link.value }).run()
}
</script>

<template>
  <div class="dropped mt-8 mb-12 flex flex-col">
    <div
      class="relative flex w-full border border-b-0 border-[var(--ui-border)] bg-[var(--ui-primary-300)] px-6 py-2 font-bold text-[var(--ui-primary-900)]"
    >
      Try it
      <DevOnly class="ml-auto">
        <ClientOnly>
          <UButton
            icon="i-ri:clipboard-line"
            class="ml-auto"
            @click="copyContent"
          />
        </ClientOnly>
      </DevOnly>
    </div>
    <div
      class="relative w-full flex-1 overflow-y-auto border border-[var(--ui-border)] bg-[var(--ui-bg)] p-8"
    >
      <ClientOnly>
        <Editor
          v-if="editor"
          :editor="editor"
          aria-label="Rich text editor"
          class="h-full "
          :class="{
            'not-prose': notProse,
          }"
        >
          <Transition
            name="fade"
            :duration="200"
          >
            <Commands
              v-if="showCommands"
              :commands="commands"
            >
              <template #default="{ commands: commandsProp, selectedIndex, selectItem }">
                <UButtonGroup
                  orientation="vertical"
                  class="bg-[var(--ui-bg-elevated)] inner"
                >
                  <UButton
                    v-for="command, index in commandsProp" 
                    :key="command.id" 
                    :label="command.label" 
                    color="neutral" 
                    variant="ghost" 
                    :class="{
                      'bg-white/20': selectedIndex === index,
                    }"
                    @click="selectItem(index)" 
                  />
                </UButtonGroup>
              </template>
            </Commands>
          </Transition>
          <Transition
            :name="transitionBubbleMenu ? 'fade' : undefined"
            :duration="transitionBubbleMenu ? 200 : 0"
          >
            <BubbleMenu
              v-if="bubbleMenu"
              @close="tryUnhighlight"
            >
              <div class="inner">
                <div
                  v-if="showInput"
                  class="flex items-center"
                >
                  <UInput
                    placeholder="Edit with AI"
                    :ui="{
                      root: '!border-r-0',
                      base: 'rounded-r-none outline-0',
                    }"
                    @focus="tryHighlight"
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
                    size="sm"
                    variant="ghost"
                    color="neutral"
                    :class="{
                      'bg-white/20': editor.isActive('bold'),
                    }"
                    icon="i-ri:bold"
                    @click="editor?.chain().focus().toggleBold().run()"
                  />
                  <UButton
                    size="sm"
                    variant="ghost"
                    color="neutral"
                    :class="{
                      'bg-white/20': editor.isActive('italic'),
                    }"
                    icon="i-ri:italic"
                    @click="editor?.chain().focus().toggleItalic().run()"
                  />
                  <UPopover :portal="false">
                    <UButton
                      size="sm"
                      variant="ghost"
                      color="neutral"
                      :class="{
                        'bg-white/20': editor.isActive('italic'),
                      }"
                      icon="i-ri:link"
                    />
                    <template #content>
                      <form @submit.prevent="addLink">
                        <UButtonGroup size="lg">
                          <UInput
                            v-model="link"
                            placeholder="Add a link"
                          />
                          <UButton
                            type="submit"
                            icon="i-ri:link"
                          />
                        </UButtonGroup>
                      </form>
                    </template>
                  </UPopover>
                </UButtonGroup>
              </div>
            </BubbleMenu>
          </Transition>
        </Editor>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.fade-enter-active .inner,
.fade-leave-active .inner {
  transition: all 0.2s ease;
}

.fade-enter-to .inner,
.fade-leave-from .inner {
  opacity: 1;
  scale: 1;
}

.fade-enter-from .inner,
.fade-leave-to .inner {
  opacity: 0;
  scale: 0.9;
}
</style>
