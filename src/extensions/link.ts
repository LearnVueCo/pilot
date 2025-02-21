import { Link, type LinkOptions } from '@tiptap/extension-link'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { defu } from 'defu'

export type LinkExtensionOptions = Partial<
  LinkOptions & {
    openOnMetaClick: boolean
  }
>

export const LinkExtension = (options: LinkExtensionOptions = {}) => {
  const defaultOptions: Partial<LinkExtensionOptions> = {
    openOnClick: false,
    openOnMetaClick: true,
    autolink: false,
  }

  const mergedOptions = defu(options, defaultOptions)

  const { openOnMetaClick } = mergedOptions

  return Link.configure(mergedOptions).extend({
    addProseMirrorPlugins() {
      return [
        ...(openOnMetaClick
          ? [
              new Plugin({
                key: new PluginKey('linkClickHandler'),
                props: {
                  handleClick: (view, _pos, event) => {
                    const qualifiedClick =
                      event.button === 1 ||
                      (event.button === 0 && (event.metaKey || event.ctrlKey))

                    if (!view.editable || !qualifiedClick) {
                      return false
                    }

                    let target = event.target as HTMLElement
                    while (
                      target !== null &&
                      target.nodeName !== 'A' &&
                      target.nodeName !== 'DIV'
                    ) {
                      target = target.parentNode as HTMLElement
                    }

                    if (target?.nodeName !== 'A') {
                      return false
                    }

                    const href = target.getAttribute('href')
                    if (href === null) {
                      return false
                    }

                    window.open(href, '_blank', 'noopener noreferrer')
                    return true
                  },
                },
              }),
            ]
          : []),
      ]
    },
  })
}
