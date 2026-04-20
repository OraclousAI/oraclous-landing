'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import { useUIStore } from '@/stores/ui.store'

/**
 * Wraps each page with an enter animation.
 * Runs once after the loader completes, then on every route change.
 */
export function PageWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isLoaderComplete = useUIStore((s) => s.isLoaderComplete)

  useEffect(() => {
    if (!ref.current || !isLoaderComplete) return
    gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y: 14 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        clearProps: 'transform',
      }
    )
  }, [pathname, isLoaderComplete])

  return (
    <div ref={ref} style={{ visibility: 'hidden' }}>
      {children}
    </div>
  )
}
