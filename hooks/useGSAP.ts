import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Scoped GSAP context hook.
 * All GSAP selectors inside `setup` are scoped to the returned ref.
 * Context is reverted on unmount or when deps change.
 *
 * Usage:
 *   const ref = useGSAP(() => {
 *     gsap.from('.card', { y: 40, opacity: 0 })
 *   }, [isReady])
 *   return <section ref={ref}>...</section>
 */
export function useGSAP<T extends Element = HTMLDivElement>(
  setup: () => void,
  deps: React.DependencyList = []
) {
  const scopeRef = useRef<T | null>(null)

  useEffect(() => {
    const ctx = gsap.context(setup, scopeRef)
    return () => ctx.revert()
    // `setup` is intentionally excluded — callers pass deps explicitly
    // biome-ignore lint/correctness/useExhaustiveDependencies: setup excluded by design
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return scopeRef
}
