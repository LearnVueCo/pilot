---
title: Task Lists
subheading: Add task lists to your editor
---

Pilot uses Tiptap's [TaskList](https://tiptap.dev/docs/editor/extensions/functionality/tasklist) extension to add task lists to your editor. 

:editor-content{content="<ul data-type='taskList'><li data-checked='true'><label><input type='checkbox'/></label><div><p>Task 1</p></div></li><li data-checked='false'><label><input type='checkbox'/></label><div><p>Task 2</p></div></li><li data-checked='false'><label><input type='checkbox'/></label><div><p>Task 3</p></div></li></ul>" show-task-lists}

## Custom Components

You can also use custom components to render your task list items.

```ts
import { EditorExtensions, useEditor } from '@learnvue/pilot'
import CustomTaskItem from './components/CustomTaskItem.vue'

const editor = useEditor({
  extensions: [
    ...EditorExtensions({
      taskItem: {
        customComponent: CustomTaskItem,
      },
    }),
  ],
})
```

For your component to be compatible with Tiptap's node system, it must:

1. Be wrapped in a `NodeViewWrapper` component
2. Use a `NodeViewContent` component for any editable content
3. Use `NodeViewProps` as the prop type for your component

`NodeViewProps` allows you to get and set the `checked` attribute of a task list item. 

```vue
<script setup lang="ts">
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/vue-3'
import { computed } from 'vue'

const { node, updateAttributes } = defineProps<NodeViewProps>()

const checked = computed({
  get: () => node.attrs.checked,
  set: (value) => updateAttributes({ checked: value }),
})
</script>

<template>
  <NodeViewWrapper as="li">
    <UCheckbox
      v-model="checked"
      variant="outline"
      class="mt-0.5"
      color="neutral"
      aria-label="Toggle list item completion"
    />
    <NodeViewContent />
  </NodeViewWrapper>
</template>

```

## Configuration

## Styling

Task Lists are `ul` elements with a `data-type="taskList"` attribute.

When a task list item is checked, it will have a `data-checked="true"` attribute.

```css
.tiptap ul[data-type="taskList"] li {
  display: flex;
  align-items: start;
  gap: 0.5rem;
}

.tiptap ul[data-type="taskList"] li[data-checked="true"] {
  @apply text-gray-500 line-through;
}
```

