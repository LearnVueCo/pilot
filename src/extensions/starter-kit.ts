import StarterKit, { type StarterKitOptions } from '@tiptap/starter-kit'
import { defu } from 'defu'

export type StarterKitExtensionOptions = Partial<StarterKitOptions>

export const StarterKitExtension = (
  options: StarterKitExtensionOptions = {},
) => {
  const defaultOptions: Partial<StarterKitOptions> = {
    heading: {
      levels: [1, 2, 3],
    },
    codeBlock: false,
    horizontalRule: {
      HTMLAttributes: {
        'data-type': 'draggable',
      },
    },
    dropcursor: {
      color: '#ff00ff',
    },
  }

  const mergedOptions = defu(options, defaultOptions)

  return StarterKit.configure(mergedOptions).extend({
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          const handleEnter = () =>
            this.editor.commands.first(({ commands }) => [
              () => commands.newlineInCode(),
              () => commands.createParagraphNear(),
              () => commands.liftEmptyBlock(),
              () => commands.splitBlock(),
            ])

          handleEnter()
          this.editor
            .chain()
            .command(({ tr }) => {
              tr.setStoredMarks([])
              return true
            })
            .run()

          return true
        },
      }
    },
  })
}
