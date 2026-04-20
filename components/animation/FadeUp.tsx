'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface FadeUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  once?: boolean
}

export function FadeUp({
  children,
  className,
  delay = 0,
  y = 28,
  duration = DUR.standard,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.set(el, { opacity: 0, y })

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration, delay, ease: EASE.entrance }),
      onLeaveBack: once
        ? undefined
        : () => gsap.set(el, { opacity: 0, y }),
    })

    return () => {
      st.kill()
      gsap.killTweensOf(el)
    }
  }, [delay, y, duration, once])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
