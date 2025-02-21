import GlobalDragHandle, {
  type GlobalDragHandleOptions,
} from 'tiptap-extension-global-drag-handle'
import { defu } from 'defu'

export type DragHandleExtensionOptions = Partial<GlobalDragHandleOptions>

export const DragHandleExtension = (
  options: DragHandleExtensionOptions = {},
) => {
  const defaultOptions: Partial<GlobalDragHandleOptions> = {
    customNodes: ['draggable'],
  }

  const mergedOptions = defu(options, defaultOptions)

  return GlobalDragHandle.configure(mergedOptions)
}
