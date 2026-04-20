'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useUIStore } from '@/stores/ui.store'

const LenisContext = createContext<Lenis | null>(null)

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext)
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const { prefersReducedMotion, setScrollY } = useUIStore()

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    setLenis(instance)

    instance.on('scroll', () => {
      setScrollY(instance.scroll)
      ScrollTrigger.update()
    })

    /* Sync GSAP ticker with Lenis RAF loop */
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [prefersReducedMotion, setScrollY])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
