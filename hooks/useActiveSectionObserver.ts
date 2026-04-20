'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/stores/ui.store'

/**
 * Watches a list of section IDs via IntersectionObserver.
 * Updates Zustand activeSection when a section crosses the 40% threshold.
 * Call from any page-level client component.
 */
export function useActiveSectionObserver(sectionIds: readonly string[]) {
  const setActiveSection = useUIStore((s) => s.setActiveSection)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (!el) continue

      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActiveSection(id)
          }
        },
        { threshold: 0.4 },
      )
      obs.observe(el)
      observers.push(obs)
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [sectionIds, setActiveSection])
}
