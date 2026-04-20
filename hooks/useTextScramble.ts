'use client'

import { useRef, useCallback } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'

/**
 * Scrambles an element's text content on trigger, then resolves to the final string.
 *
 * Usage:
 *   const { ref, scramble } = useTextScramble()
 *   return (
 *     <span ref={ref} onMouseEnter={() => scramble('HOVER TEXT')}>
 *       ORIGINAL TEXT
 *     </span>
 *   )
 */
export function useTextScramble<T extends HTMLElement = HTMLSpanElement>() {
  const ref = useRef<T | null>(null)
  const rafRef = useRef<number>(0)
  const iterationsRef = useRef(0)

  const scramble = useCallback((target: string) => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      el.textContent = target
      return
    }

    cancelAnimationFrame(rafRef.current)
    iterationsRef.current = 0

    const totalFrames = target.length * 3

    const tick = () => {
      const it = iterationsRef.current
      el.textContent = target
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < Math.floor(it / 3)) return target[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      if (iterationsRef.current < totalFrames) {
        iterationsRef.current++
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  return { ref, scramble }
}
