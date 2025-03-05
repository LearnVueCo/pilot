import type { Component } from 'vue'
import TaskItem, { type TaskItemOptions } from '@tiptap/extension-task-item'
import type { NodeViewProps } from '@tiptap/vue-3'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { defu } from 'defu'

export type TaskItemExtensionOptions = Partial<
  TaskItemOptions & {
    customComponent?: Component<NodeViewProps>
  }
>

export const TaskItemExtension = (options: TaskItemExtensionOptions = {}) => {
  const defaultOptions: TaskItemExtensionOptions = {
    nested: true,
  } as const

  const mergedOptions = defu(options, defaultOptions)

  const customComponent = mergedOptions.customComponent

  return TaskItem.configure(mergedOptions).extend(
    customComponent !== undefined
      ? {
          addNodeView() {
            return VueNodeViewRenderer(customComponent)
          },
        }
      : {},
  )
}
