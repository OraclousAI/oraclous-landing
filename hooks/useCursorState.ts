import { useCallback } from 'react'
import { useUIStore } from '@/stores/ui.store'

/** Returns handlers to change the global cursor state on pointer events. */
export function useCursorState() {
  const setCursor = useUIStore((s) => s.setCursor)

  const onHoverEnter = useCallback(
    (label?: string) => setCursor('hover', label),
    [setCursor]
  )

  const onHoverLeave = useCallback(() => setCursor('default'), [setCursor])
  const onDragStart = useCallback(() => setCursor('drag'), [setCursor])
  const onDragEnd = useCallback(() => setCursor('default'), [setCursor])
  const onTextEnter = useCallback(() => setCursor('text'), [setCursor])
  const onTextLeave = useCallback(() => setCursor('default'), [setCursor])

  return { onHoverEnter, onHoverLeave, onDragStart, onDragEnd, onTextEnter, onTextLeave }
}
