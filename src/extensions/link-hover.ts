import { Extension } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export type LinkHoverExtensionOptions = {
  /**
   * Called when a mouse enters a link
   * @param el - The `a` element that the mouse entered
   * @param range - The start/end editor range of the link being hovered if it exists in the editor
   *
   */
  onMouseOver: (el: HTMLElement, range?: { start: number; end: number }) => void
  /**
   * Called when a mouse leaves a link
   * @param el - The `a` element that the mouse left
   */
  onMouseLeave: (el: HTMLElement) => void
}

export const LinkHoverExtension = (
  options: Partial<LinkHoverExtensionOptions> = {},
) => {
  const { onMouseOver, onMouseLeave } = options

  return Extension.create({
    name: 'handleLinkHover',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('hover'),
          props: {
            handleDOMEvents: {
              mouseover(_view, event) {
                const el = event.target as HTMLElement
                if (el.tagName !== 'A') {
                  return
                }

                onMouseOver?.(
                  el,
                  el.pmViewDesc
                    ? {
                        start: el.pmViewDesc.posAtStart,
                        end: el.pmViewDesc.posAtEnd,
                      }
                    : undefined,
                )
              },
              mouseout(_view, event) {
                const el = event.target as HTMLElement
                if (el.tagName !== 'A') {
                  return
                }
                onMouseLeave?.(el)
              },
            },
          },
        }),
      ]
    },
  })
}
