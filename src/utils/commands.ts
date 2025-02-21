import type { Editor, Range } from '@tiptap/vue-3'

export type EditorCommand = {
  id: string
  label: string
  command: ({ editor, range }: { editor: Editor; range: Range }) => void
  icon?: string
  filter?: ({ editor }: { editor: Editor }) => boolean
  altNames?: string[]
  [key: string]: any
}

const commandActions: Record<
  string,
  ({ editor, range }: { editor: Editor; range: Range }) => void
> = {
  h1: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 1 })
      .run()
  },
  h2: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 2 })
      .run()
  },
  h3: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 3 })
      .run()
  },
  bold: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark('bold').run()
  },
  italic: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark('italic').run()
  },
  divider: ({ editor, range }) => {
    editor.chain().deleteRange(range).setHorizontalRule().run()
  },
  unorderedList: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleBulletList().run()
  },
  orderedList: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleOrderedList().run()
  },
}

const builtInCommands: EditorCommand[] = [
  {
    id: 'h1',
    label: 'Heading 1',
    command: commandActions.h1,
    altNames: ['h1'],
  },
  {
    id: 'h2',
    label: 'Heading 2',
    command: commandActions.h2,
    altNames: ['h2'],
  },
  {
    id: 'h3',
    label: 'Heading 3',
    command: commandActions.h3,
    altNames: ['h3'],
  },
  {
    id: 'bold',
    label: 'Bold',
    command: commandActions.bold,
    altNames: ['strong'],
  },
  {
    id: 'italic',
    label: 'Italic',
    command: commandActions.italic,
    altNames: ['em'],
  },
  {
    id: 'divider',
    label: 'Divider',
    command: commandActions.divider,
    altNames: ['hr'],
  },
  {
    id: 'unorderedList',
    label: 'Unordered List',
    command: commandActions.unorderedList,
    altNames: ['ul'],
  },
  {
    id: 'orderedList',
    label: 'Ordered List',
    command: commandActions.orderedList,
    altNames: ['ol'],
  },
]

export function createCommands<T extends EditorCommand>(commands?: T[]) {
  if (!commands) {
    return builtInCommands as T[]
  }

  return commands
}
