import {
  useFloating,
  flip,
  offset,
  type VirtualElement,
} from '@floating-ui/vue'
import type { Ref } from 'vue'

export function useTooltip(
  reference: Ref<HTMLElement | VirtualElement | null>,
  tooltip: Ref<HTMLElement | null>,
) {
  const floating = useFloating(reference, tooltip, {
    placement: 'bottom',
    middleware: [flip(), offset(5)],
  })

  return {
    ...floating
  }
}
