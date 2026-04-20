'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface ParallaxLayerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /**
   * Parallax intensity. Positive = moves up as you scroll (foreground feel).
   * Negative = moves down (background feel). Range: -1 to 1. Default 0.3.
   */
  speed?: number
}

export function ParallaxLayer({ children, className, style, speed = 0.3 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate(self) {
        const progress = self.progress
        const yPercent = (progress - 0.5) * speed * -100
        gsap.set(el, { yPercent })
      },
    })

    return () => st.kill()
  }, [speed])

  return (
    <div ref={ref} className={cn('will-change-transform', className)} style={style}>
      {children}
    </div>
  )
}
