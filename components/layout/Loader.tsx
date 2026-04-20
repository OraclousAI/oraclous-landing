'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useUIStore } from '@/stores/ui.store'

/* Session key — loader only plays on first visit per tab */
const SESSION_KEY = 'oraclous_loaded'

export function Loader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const countRef     = useRef<HTMLSpanElement>(null)
  const logoRef      = useRef<HTMLSpanElement>(null)
  const setLoaderComplete = useUIStore((s) => s.setLoaderComplete)

  useEffect(() => {
    /* Skip loader on subsequent navigations within the same session */
    if (sessionStorage.getItem(SESSION_KEY)) {
      setLoaderComplete()
      if (containerRef.current) gsap.set(containerRef.current, { display: 'none' })
      return
    }

    const container = containerRef.current
    const count     = countRef.current
    const logo      = logoRef.current
    if (!container || !count || !logo) return

    const proxy = { val: 0 }

    const tl = gsap.timeline({
      onComplete() {
        sessionStorage.setItem(SESSION_KEY, '1')
        setLoaderComplete()
      },
    })

    /* Count 0 → 100 */
    tl.to(proxy, {
      val: 100,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate() {
        count.textContent = String(Math.round(proxy.val))
      },
    })
    /* Logo fades up while counter hits 100 */
    .fromTo(
      logo,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      '-=0.3'
    )
    /* Curtain exit */
    .to(container, {
      yPercent: -100,
      duration: 0.7,
      ease: 'cubic-bezier(0.7, 0, 1, 1)',
      delay: 0.2,
    })

    return () => { tl.kill() }
  }, [setLoaderComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-void)]"
      style={{ zIndex: 'var(--z-loader)' }}
    >
      <span
        ref={countRef}
        className="font-mono text-[var(--text-5xl)] font-bold text-white tabular-nums leading-none"
      >
        0
      </span>
      <span
        ref={logoRef}
        className="mt-4 font-display text-[var(--text-lg)] tracking-[0.12em] uppercase text-[var(--color-text-tertiary)]"
        style={{ visibility: 'hidden' }}
      >
        Oraclous
      </span>
    </div>
  )
}
