import { useFloating, flip, offset } from '@floating-ui/vue'
import type { Ref } from 'vue'

export function useTooltip(
  reference: Ref<HTMLElement | null>,
  tooltip: Ref<HTMLElement | null>,
) {
  const { floatingStyles } = useFloating(reference, tooltip, {
    placement: 'bottom',
    middleware: [flip(), offset(5)],
  })

  return {
    floatingStyles,
  }
}
