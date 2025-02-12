<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import { computed } from 'vue'

const { node, updateAttributes } = defineProps<{
  node: any
  updateAttributes: (args: any) => void
}>()

const checked = computed({
  get: () => node.attrs.checked,
  set: (value) => updateAttributes({ checked: value }),
})
</script>

<template>
  <NodeViewWrapper as="li">
    <UCheckbox v-model="checked" class="mt-0.5" color="primary" />
    <NodeViewContent />
  </NodeViewWrapper>
</template>
