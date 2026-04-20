'use client'

import { useRef, useEffect, type ElementType } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE, STAGGER } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface WordRevealProps {
  children: string
  className?: string
  style?: React.CSSProperties
  as?: ElementType
  delay?: number
  stagger?: number
  once?: boolean
}

/**
 * Splits text into words and mask-reveals each from below.
 * Classic "clip-path slide up" typographic reveal.
 * Children must be a plain string.
 */
export function WordReveal({
  children,
  className,
  style,
  as: Tag = 'p',
  delay = 0,
  stagger = STAGGER.section,
  once = true,
}: WordRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null)

  const words = children.split(' ')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const inners = el.querySelectorAll<HTMLElement>('[data-word-inner]')
    if (!inners.length) return

    if (prefersReducedMotion()) {
      gsap.set(inners, { y: 0 })
      return
    }

    gsap.set(inners, { y: '110%' })

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () =>
        gsap.to(inners, {
          y: 0,
          stagger,
          duration: DUR.emphasis,
          delay,
          ease: EASE.entrance,
        }),
      onLeaveBack: once
        ? undefined
        : () => gsap.set(inners, { y: '110%' }),
    })

    return () => {
      st.kill()
      gsap.killTweensOf(inners)
    }
  }, [delay, stagger, once])

  return (
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic ref
    <Tag ref={containerRef as React.Ref<any>} className={cn(className)} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            paddingBottom: '0.08em',
            marginRight: i < words.length - 1 ? '0.25em' : 0,
          }}
        >
          <span data-word-inner="" style={{ display: 'inline-block' }}>
            {word}
          </span>
        </span>
      ))}
    </Tag>
  )
}
