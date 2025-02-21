import { Markdown, type MarkdownOptions } from 'tiptap-markdown'
import { defu } from 'defu'

export type MarkdownExtensionOptions = Partial<MarkdownOptions>

export const MarkdownExtension = (options: MarkdownExtensionOptions = {}) => {
  const defaultOptions: Partial<MarkdownOptions> = {
    html: true,
    tightLists: true,
    tightListClass: 'tight',
    bulletListMarker: '-',
    linkify: false,
    breaks: false,
    transformPastedText: true,
    transformCopiedText: true,
  }

  const mergedOptions = defu(options, defaultOptions)

  return Markdown.configure(mergedOptions)
}
