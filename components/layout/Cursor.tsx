'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

const SCALE_MAP: Record<string, number> = {
  default: 1,
  hover:   2.5,
  drag:    2.0,
  text:    0.3,
  hidden:  0,
}

export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const cursorState = useUIStore((s) => s.cursorState)
  const cursorLabel = useUIStore((s) => s.cursorLabel)

  /* Mouse tracking — quickTo for maximum performance */
  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    /* Touch devices have no hover concept — bail out */
    if (window.matchMedia('(pointer: coarse)').matches) return

    const moveDot  = { x: gsap.quickTo(dot,  'x', { duration: 0.08 }), y: gsap.quickTo(dot,  'y', { duration: 0.08 }) }
    const moveRing = { x: gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' }), y: gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' }) }

    const onMove = (e: MouseEvent) => {
      moveDot.x(e.clientX)
      moveDot.y(e.clientY)
      moveRing.x(e.clientX)
      moveRing.y(e.clientY)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* State-driven ring scale */
  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    gsap.to(ring, {
      scale:   SCALE_MAP[cursorState] ?? 1,
      opacity: cursorState === 'hidden' ? 0 : 1,
      duration: 0.15,
      ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    })
  }, [cursorState])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 hidden md:block"
      style={{ zIndex: 'var(--z-cursor)' }}
    >
      {/* Dot — precise follower */}
      <div
        ref={dotRef}
        className={cn(
          'absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full',
          'bg-white mix-blend-difference'
        )}
        style={{ willChange: 'transform' }}
      />

      {/* Ring — lagged follower with state-driven scale */}
      <div
        ref={ringRef}
        className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 flex items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        {cursorLabel && (
          <span
            className="text-white font-mono text-[9px] tracking-[0.12em] uppercase select-none"
          >
            {cursorLabel}
          </span>
        )}
      </div>
    </div>
  )
}
