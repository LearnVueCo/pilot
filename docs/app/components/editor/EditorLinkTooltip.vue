<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
const props = defineProps<{
  editor: Editor
}>()

const { isHovered, reference, to } = useLinkHover(props.editor)

const {
  editing,
  url,
  linkText,
  position,
  isNewLink,
  initializeLinkEdit,
  setLink,
  removeLink,
} = useLinkEdit(props.editor, {
  highlight: true,
  highlightClass: 'bg-blue-400/45 py-[2.5px]',
})

defineShortcuts({
  meta_k: {
    handler: () => {
      initializeLinkEdit()
    },
    usingInput: true,
  },
})

</script>

<template>
  <EditorTooltip
    v-if="!editing"
    v-model:open="isHovered"
    :position="reference"
    :editor="editor"
  >
    <div
      class="flex items-center gap-1 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-accented)] px-2 py-1 text-sm"
    >
      <NuxtLink
        v-if="to"
        :to="to"
        class="text-blue-300 hover:underline"
      >
        {{ to }}
      </NuxtLink>
      <div class="flex items-center">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-ri:file-copy-line"
          size="xs"
        />
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-ri:pencil-line"
          size="xs"
          @click="initializeLinkEdit(reference!)"
        />
      </div>
    </div>
  </EditorTooltip>
  <EditorTooltip
    v-model:open="editing"
    :position="position"
    :editor="editor"
    :close-on-hover="false"
    class="w-80"
  >
    <div
      class="flex flex-col items-center gap-1 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-accented)] p-2 text-sm"
    >
      <form
        class="flex w-full flex-col gap-3"
        @submit.prevent="setLink"
      >
        <UFormField
          label="URL"
          :ui="{
            label: 'text-xs opacity-80',
          }"
        >
          <UInput
            v-model="url"
            class="w-full"
            autofocus
            @keydown.enter="setLink"
          />
        </UFormField>
        <UFormField
          v-if="linkText !== undefined"
          label="Link text"
          :ui="{
            label: 'text-xs opacity-80',
          }"
        >
          <UInput
            v-model="linkText"
            class="w-full"
            @keydown.enter="setLink"
          />
        </UFormField>
        <UButton
          v-if="!isNewLink"
          variant="ghost"
          color="neutral"
          size="xs"
          leading-icon="i-ri:delete-bin-5-fill"
          @click="removeLink"
        >
          Remove
        </UButton>
      </form>
    </div>
  </EditorTooltip>
</template>