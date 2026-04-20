'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.set(el, { scaleY: self.progress })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '2px',
        height: '100vh',
        zIndex: 'var(--z-sticky)',
        backgroundColor: 'rgba(67,97,238,0.08)',
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(to bottom, var(--color-accent), var(--color-secondary))',
          transformOrigin: 'top center',
          transform: 'scaleY(0)',
          willChange: 'transform',
          boxShadow: '0 0 8px rgba(67,97,238,0.5)',
        }}
      />
    </div>
  )
}
