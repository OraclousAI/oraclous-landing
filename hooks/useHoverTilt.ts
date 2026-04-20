'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

interface HoverTiltOptions {
  /** Max rotation in degrees. Default: 8 */
  max?: number
  /** Perspective depth in px. Default: 800 */
  perspective?: number
  /** GSAP ease for leave spring. Default: elastic.out(1, 0.4) */
  leaveEase?: string
}

/**
 * Applies a perspective tilt toward the cursor on hover.
 * Returns a ref to attach to the element.
 *
 * Usage:
 *   const ref = useHoverTilt()
 *   return <div ref={ref}>...</div>
 */
export function useHoverTilt<T extends HTMLElement = HTMLDivElement>({
  max = 8,
  perspective = 800,
  leaveEase = 'elastic.out(1, 0.4)',
}: HoverTiltOptions = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    gsap.set(el, { transformPerspective: perspective })

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const rotY = ((e.clientX - cx) / (rect.width / 2)) * max
      const rotX = -((e.clientY - cy) / (rect.height / 2)) * max

      gsap.to(el, {
        rotationX: rotX,
        rotationY: rotY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const onLeave = () => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        ease: leaveEase,
      })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.set(el, { rotationX: 0, rotationY: 0 })
    }
  }, [max, perspective, leaveEase])

  return ref
}
