'use client'

import { useRef, useEffect, type ElementType } from 'react'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'
import { DUR, EASE, STAGGER } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  as?: ElementType
  delay?: number
  stagger?: number
  once?: boolean
}

export function TextReveal({
  children,
  className,
  style,
  as: Tag = 'p',
  delay = 0,
  stagger = STAGGER.siblings,
  once = true,
}: TextRevealProps) {
  // biome-ignore lint/suspicious/noExplicitAny: polymorphic component needs flexible ref type
  const ref = useRef<any>(null)

  useEffect(() => {
    const el = ref.current as HTMLElement | null
    if (!el) return

    if (prefersReducedMotion()) return

    const split = new SplitText(el, { type: 'chars,words' })
    gsap.set(split.chars, { opacity: 0, y: 18 })

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () =>
        gsap.to(split.chars, {
          opacity: 1,
          y: 0,
          stagger,
          duration: DUR.emphasis,
          delay,
          ease: EASE.entrance,
        }),
      onLeaveBack: once
        ? undefined
        : () => gsap.set(split.chars, { opacity: 0, y: 18 }),
    })

    return () => {
      st.kill()
      gsap.killTweensOf(split.chars)
      split.revert()
    }
  }, [delay, stagger, once])

  return (
    <Tag ref={ref} className={cn(className)} style={style}>
      {children}
    </Tag>
  )
}
