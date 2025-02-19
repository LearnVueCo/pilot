import { ref, onMounted, onBeforeUnmount, readonly } from 'vue'
import { type Editor, type Range } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

type UseLinkHoverOptions = {
  /**
   * If true, the hover will be closed immediately when the mouse is moved out of the hovered element. This means that if the hover state is used to show a tooltip, the tooltip cannot be interacted with.
   */
  immediatelyClose?: boolean
  /**
   * The delay in milliseconds before the hover state is shown.
   */
  delay?: number
}

export function useLinkHover(
  editor: Ref<Editor | null | undefined>,
  options: UseLinkHoverOptions = {},
) {
  const { immediatelyClose = false, delay = 400 } = options
  const to = ref<string | null>(null)
  const isHovered = ref(false)
  const reference = ref<Range | null>(null)
  const hoveredLink = ref<HTMLElement | null>(null)
  const pluginKey = new PluginKey('link-hover')

  const { start, stop } = useTimeoutFn(
    (el: HTMLElement) => {
      if (!el) {
        isHovered.value = false
        return
      }
      hoveredLink.value = el
      isHovered.value = true
      reference.value = {
        from: el.pmViewDesc?.posAtStart ?? 0,
        to: el.pmViewDesc?.posAtEnd ?? 0,
      }
      to.value = (el as HTMLAnchorElement).href
    },
    delay,
    {
      immediate: false,
    },
  )

  onMounted(() => {
    if (!editor.value) {
      return
    }

    editor.value.registerPlugin(
      new Plugin({
        key: pluginKey,
        props: {
          handleDOMEvents: {
            mouseover(view, event) {
              let el = event.target as HTMLElement
              while (el.tagName !== 'A' && el.parentElement) {
                el = el.parentElement
              }
              if (el.tagName !== 'A') {
                return
              }
              start(el)
              return true
            },
            mouseout(view, event) {
              const el = event.target as HTMLElement
              stop()
              // if reference is the same as the hovered element's reference, close the hover
              if (
                reference.value?.from === el.pmViewDesc?.posAtStart &&
                reference.value?.to === el.pmViewDesc?.posAtEnd &&
                immediatelyClose
              ) {
                isHovered.value = false
                reference.value = null
                hoveredLink.value = null
                return true
              }
              return false
            },
          },
        },
        // Recalculate reference on content update
        state: {
          init() {
            return {}
          },
          apply(tr, value) {
            // Update reference when the document changes
            if (tr.docChanged && hoveredLink.value) {
              reference.value = {
                from: hoveredLink.value.pmViewDesc?.posAtStart ?? 0,
                to: hoveredLink.value.pmViewDesc?.posAtEnd ?? 0,
              }
            }
            return value
          },
        },
      }),
    )
  })

  onBeforeUnmount(() => {
    if (!editor.value) {
      return
    }
    editor.value.unregisterPlugin(pluginKey)
  })

  return {
    isHovered,
    reference,
    to: readonly(to),
  }
}
