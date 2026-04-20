'use client'

import { useRef, useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface PinSectionProps {
  children: React.ReactNode
  className?: string
  /** ScrollTrigger start string. Default: 'top top' */
  start?: string
  /** ScrollTrigger end string. Default: '+=100%' */
  end?: string
  pinSpacing?: boolean
  /** Called on each ScrollTrigger update with 0–1 progress. */
  onProgress?: (progress: number) => void
}

/**
 * Pins its children for a scroll distance then releases.
 * Use as a container for scroll-jacked scenes.
 *
 * Usage:
 *   <PinSection end="+=200%">
 *     <div className="sticky-scene">...</div>
 *   </PinSection>
 */
export function PinSection({
  children,
  className,
  start = 'top top',
  end = '+=100%',
  pinSpacing = true,
  onProgress,
}: PinSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      pin: true,
      pinSpacing,
      onUpdate: onProgress ? (self) => onProgress(self.progress) : undefined,
    })

    return () => st.kill()
    // biome-ignore lint/correctness/useExhaustiveDependencies: onProgress intentionally excluded — use useCallback at callsite
  }, [start, end, pinSpacing])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
