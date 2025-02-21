import TaskList, { type TaskListOptions } from '@tiptap/extension-task-list'
import { defu } from 'defu'

export type TaskListExtensionOptions = Partial<TaskListOptions>

export const TaskListExtension = (options: TaskListExtensionOptions = {}) => {
  const defaultOptions: Partial<TaskListOptions> = {}

  const mergedOptions = defu(options, defaultOptions)

  return TaskList.configure(mergedOptions)
}
