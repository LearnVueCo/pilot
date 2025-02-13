<script setup lang="ts">
import type { NodeViewConstructor } from '@tiptap/pm/view'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import { computed } from 'vue'

const { node, updateAttributes } = defineProps<{
  node: Parameters<NodeViewConstructor>[0]
  updateAttributes: (args: any) => void
}>()

const checked = computed({
  get: () => node.attrs.checked,
  set: (value) => updateAttributes({ checked: value }),
})
</script>

<template>
  <NodeViewWrapper as="li">
    <UCheckbox
      v-model="checked"
      class="mt-0.5"
      color="primary"
      aria-label="Toggle list item completion"
    />
    <NodeViewContent />
  </NodeViewWrapper>
</template>
