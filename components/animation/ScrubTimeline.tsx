'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface ScrubTimelineProps {
  children: React.ReactNode
  className?: string
  /** Passed a blank timeline and the container element. Add your tweens here. */
  setup: (tl: gsap.core.Timeline, el: HTMLDivElement) => void
  start?: string
  end?: string
  /** Number = smoothing lag in seconds; true = 1s; false = instant. Default: 1 */
  scrub?: boolean | number
  pin?: boolean
  pinSpacing?: boolean
}

/**
 * Scroll-scrubbed GSAP timeline container.
 *
 * Usage:
 *   <ScrubTimeline
 *     start="top center"
 *     end="bottom center"
 *     setup={(tl) => {
 *       tl.fromTo('.hero-text', { opacity: 0 }, { opacity: 1 })
 *       tl.fromTo('.hero-img', { scale: 1.2 }, { scale: 1 }, '<')
 *     }}
 *   >
 *     <div className="hero-text">...</div>
 *     <div className="hero-img">...</div>
 *   </ScrubTimeline>
 */
export function ScrubTimeline({
  children,
  className,
  setup,
  start = 'top center',
  end = 'bottom center',
  scrub = 1,
  pin = false,
  pinSpacing = true,
}: ScrubTimelineProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: prefersReducedMotion() ? false : scrub,
        pin,
        pinSpacing,
      },
    })

    setup(tl, el)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: setup excluded — callers pass stable refs
  }, [start, end, scrub, pin, pinSpacing])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
