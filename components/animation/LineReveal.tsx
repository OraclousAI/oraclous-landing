'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface LineRevealProps {
  className?: string
  style?: React.CSSProperties
  delay?: number
  duration?: number
  color?: string
  thickness?: string | number
  once?: boolean
  /** 'left' = expand from left (default), 'center' = expand from center */
  origin?: 'left' | 'center' | 'right'
}

export function LineReveal({
  className,
  style: outerStyle,
  delay = 0,
  duration = DUR.emphasis,
  color = 'var(--color-border-accent)',
  thickness = 1,
  once = true,
  origin = 'left',
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const originMap = { left: 'left center', center: 'center center', right: 'right center' }

    if (prefersReducedMotion()) {
      gsap.set(el, { scaleX: 1 })
      return
    }

    gsap.set(el, { scaleX: 0, transformOrigin: originMap[origin] })

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () =>
        gsap.to(el, { scaleX: 1, duration, delay, ease: EASE.entrance }),
      onLeaveBack: once
        ? undefined
        : () => gsap.set(el, { scaleX: 0, transformOrigin: originMap[origin] }),
    })

    return () => {
      st.kill()
      gsap.killTweensOf(el)
    }
  }, [delay, duration, once, origin])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        width: '100%',
        height: typeof thickness === 'number' ? `${thickness}px` : thickness,
        backgroundColor: color,
        ...outerStyle,
      }}
    />
  )
}
