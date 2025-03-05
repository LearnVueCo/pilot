import { type NodeViewProps, VueNodeViewRenderer } from '@tiptap/vue-3'
import {
  CodeBlockShiki,
  type CodeBlockShikiOptions,
} from 'tiptap-extension-code-block-shiki'
import type { Component } from 'vue'

export type CodeBlockExtensionOptions = Partial<CodeBlockShikiOptions> & {
  customComponent?: Component<NodeViewProps>
}

export const CodeBlockExtension = (options: CodeBlockExtensionOptions = {}) => {
  return CodeBlockShiki.configure({
    ...options,
  }).extend({
    ...(options.customComponent
      ? {
          addNodeView: () => {
            return VueNodeViewRenderer(options.customComponent!)
          },
        }
      : {}),
  })
}
