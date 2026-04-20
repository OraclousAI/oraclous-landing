'use client'
import { useEffect } from 'react'
import { useUIStore } from '@/stores/ui.store'
import { prefersReducedMotion, onMotionPreferenceChange } from '@/lib/motion'

/** Syncs the OS reduced-motion preference into Zustand and returns the current value. */
export function useReducedMotion(): boolean {
  const stored = useUIStore((s) => s.prefersReducedMotion)
  const set = useUIStore((s) => s.setPrefersReducedMotion)

  useEffect(() => {
    set(prefersReducedMotion())
    return onMotionPreferenceChange(set)
  }, [set])

  return stored
}
