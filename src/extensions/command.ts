import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import {
  type SuggestionKeyDownProps,
  type SuggestionProps,
} from '@tiptap/suggestion'

const suggestion = {
  render: () => {
    let commandProps: SuggestionProps | null = null

    return {
      onStart: (props: SuggestionProps) => {
        commandProps = props
        if (!props.clientRect) {
          return
        }

        const tr = props.editor.view.state.tr.setMeta('suggestionProps', {
          clientRect: props.clientRect,
          active: true,
          props: commandProps,
        })

        props.editor.view.dispatch(tr)
      },

      onUpdate(props: SuggestionProps) {
        commandProps = props
        if (!props.clientRect) {
          return
        }

        const tr = props.editor.view.state.tr.setMeta('suggestionProps', {
          clientRect: props.clientRect,
          active: true,
          props: commandProps,
        })

        props.editor.view.dispatch(tr)
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          const tr = props.view.state.tr.setMeta('suggestionProps', {
            active: false,
          })
          props.view.dispatch(tr)
          return true
        }

        const tr = props.view.state.tr.setMeta('suggestionKeyDown', props)
        props.view.dispatch(tr)

        if (['ArrowUp', 'ArrowDown', 'Enter'].includes(props.event.key)) {
          return true
        }
      },

      onExit() {
        if (commandProps?.editor) {
          const tr = commandProps.editor.view.state.tr.setMeta(
            'suggestionProps',
            {
              active: false,
            },
          )
          commandProps.editor.view.dispatch(tr)
        }
      },
    }
  },
}

export const CommandExtension = () => {
  const extension = Extension.create({
    name: 'custom-commands',

    addOptions() {
      return {
        suggestion: {
          char: '/',
          command: ({ editor, range, props }: any) => {
            props.command({ editor, range })
          },
        },
      }
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ]
    },
  })

  return extension.configure({
    suggestion,
  })
}
