import type { AnyExtension } from '@tiptap/vue-3'
import {
  StarterKitExtension,
  TaskItemExtension,
  TaskListExtension,
  LinkExtension,
  CommandExtension,
  PlaceholderExtension,
  LinkHoverExtension,
  DragHandleExtension,
  MarkdownExtension,
  TextAlignExtension,
  CodeBlockExtension,
  ImageExtension,
} from '../../'

import type {
  StarterKitExtensionOptions,
  TaskItemExtensionOptions,
  TaskListExtensionOptions,
  LinkExtensionOptions,
  PlaceholderExtensionOptions,
  LinkHoverExtensionOptions,
  DragHandleExtensionOptions,
  MarkdownExtensionOptions,
  TextAlignExtensionOptions,
  CodeBlockExtensionOptions,
  ImageExtensionOptions,
} from '../../'

type EditorExtensionsOptions = {
  starterKit?: StarterKitExtensionOptions
  taskItem?: TaskItemExtensionOptions
  taskList?: TaskListExtensionOptions
  link?: LinkExtensionOptions
  placeholder?: PlaceholderExtensionOptions
  linkHover?: LinkHoverExtensionOptions
  dragHandle?: DragHandleExtensionOptions
  markdown?: MarkdownExtensionOptions
  textAlign?: TextAlignExtensionOptions
  codeBlock?: CodeBlockExtensionOptions
  image?: ImageExtensionOptions
}

export const EditorExtensions = (
  options: EditorExtensionsOptions = {},
): AnyExtension[] => {
  return [
    StarterKitExtension({
      codeBlock: false,
      ...options.starterKit,
    }),
    TaskItemExtension(options.taskItem),
    TaskListExtension(options.taskList),
    CommandExtension(),
    LinkExtension(options.link),
    PlaceholderExtension(options.placeholder),
    LinkHoverExtension(options.linkHover),
    DragHandleExtension(options.dragHandle),
    MarkdownExtension(options.markdown),
    TextAlignExtension(options.textAlign),
    CodeBlockExtension(options.codeBlock),
    ImageExtension(options.image),
  ]
}
