'use client'

import { useRef, useEffect, type ElementType } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface CountUpProps {
  to: number
  from?: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  delay?: number
  ease?: string
  className?: string
  style?: React.CSSProperties
  as?: ElementType
  once?: boolean
}

export function CountUp({
  to,
  from = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = DUR.cinematic,
  delay = 0,
  ease = 'power2.out',
  className,
  style,
  as: Tag = 'span',
  once = true,
}: CountUpProps) {
  // biome-ignore lint/suspicious/noExplicitAny: polymorphic ref
  const ref = useRef<any>(null)

  useEffect(() => {
    const el = ref.current as HTMLElement | null
    if (!el) return

    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`
      return
    }

    const counter = { val: from }
    el.textContent = `${prefix}${from.toFixed(decimals)}${suffix}`

    let tween: gsap.core.Tween

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => {
        tween = gsap.to(counter, {
          val: to,
          duration,
          delay,
          ease,
          onUpdate() {
            el.textContent = `${prefix}${counter.val.toFixed(decimals)}${suffix}`
          },
        })
      },
      onLeaveBack: once
        ? undefined
        : () => {
            tween?.kill()
            counter.val = from
            el.textContent = `${prefix}${from.toFixed(decimals)}${suffix}`
          },
    })

    return () => {
      st.kill()
      tween?.kill()
    }
  }, [to, from, prefix, suffix, decimals, duration, delay, ease, once])

  return (
    <Tag ref={ref} className={cn(className)} style={style}>
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </Tag>
  )
}
