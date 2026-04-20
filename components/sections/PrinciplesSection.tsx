'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { principles } from '@/content/principles'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'

const ACCENTS = ['#4361EE', '#8B5CF6', '#22C55E', '#F97316']
const ACCENT_DIMS = [
  'rgba(67,97,238,0.12)',
  'rgba(139,92,246,0.12)',
  'rgba(34,197,94,0.12)',
  'rgba(249,115,22,0.12)',
]

/*
  Per-principle unique hover signatures:
  0 — Open Source    : ghost ordinal reveals dramatically
  1 — No Vendor Lock : padlock appears locked → shackle breaks free (not a glitch shake)
  2 — Data Ownership : security scan line sweeps top → bottom
  3 — Self-Hosted    : border light travels left → right on repeat
*/
function PrincipleCard({ principle, accent, accentDim, index }: {
  principle: typeof principles[number]
  accent: string
  accentDim: string
  index: number
}) {
  const cardRef        = useRef<HTMLDivElement>(null)
  const spotRef        = useRef<HTMLDivElement>(null)
  const ghostRef       = useRef<HTMLSpanElement>(null)
  const scanRef        = useRef<HTMLDivElement>(null)
  const borderLightRef = useRef<HTMLDivElement>(null)
  const lockIconRef    = useRef<SVGSVGElement>(null)
  const lockShackleRef = useRef<SVGPathElement>(null)
  // biome-ignore lint/suspicious/noExplicitAny
  const qGX = useRef<any>(null)
  // biome-ignore lint/suspicious/noExplicitAny
  const qGY = useRef<any>(null)

  useEffect(() => {
    const card  = cardRef.current
    const ghost = ghostRef.current
    if (!card || prefersReducedMotion()) return
    gsap.set(card, { transformPerspective: 1000 })
    if (ghost) {
      qGX.current = gsap.quickTo(ghost, 'x', { duration: 0.8, ease: 'power2.out' })
      qGY.current = gsap.quickTo(ghost, 'y', { duration: 0.8, ease: 'power2.out' })
    }
    return () => gsap.killTweensOf(card)
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top)  / rect.height
    gsap.to(card, { rotateX: -(y - 0.5) * 16, rotateY: (x - 0.5) * 16, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    qGX.current?.((x - 0.5) * 20)
    qGY.current?.((y - 0.5) * 20)
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${accentDim.replace('0.12', '0.35')}, transparent 55%)`
      spotRef.current.style.opacity = '1'
    }
  }

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderTopColor = accent
    if (prefersReducedMotion()) return

    switch (index) {
      case 0:
        /* Ghost ordinal reveals dramatically */
        gsap.to(ghostRef.current, { opacity: 0.25, scale: 1.35, duration: 0.5, ease: 'power2.out' })
        break
      case 1:
        /* Padlock appears locked, then shackle breaks free — "no vendor lock" */
        gsap.killTweensOf(lockIconRef.current)
        gsap.killTweensOf(lockShackleRef.current)
        gsap.set(lockShackleRef.current, { attr: { d: 'M10 14 Q10 4 16 4 Q22 4 22 14' } })
        gsap.set(lockIconRef.current, { opacity: 0, y: 0, rotation: 0 })
        /* Step 1: appear */
        gsap.to(lockIconRef.current, { opacity: 1, duration: 0.2 })
        /* Step 2: shackle pops open (breaks free) */
        gsap.to(lockShackleRef.current, {
          attr: { d: 'M10 14 Q10 4 16 4 Q22 4 22 6' },
          duration: 0.28, ease: 'back.out(2)', delay: 0.25,
        })
        /* Step 3: lock floats up and fades — it can't hold */
        gsap.to(lockIconRef.current, {
          y: -10, opacity: 0, duration: 0.4, ease: 'power2.in', delay: 0.65,
        })
        break
      case 2:
        /* Security scan line sweeps down */
        gsap.fromTo(scanRef.current,
          { top: '-2px', opacity: 1 },
          { top: '102%', opacity: 0.3, duration: 0.65, ease: 'power1.inOut' }
        )
        break
      case 3:
        /* Border light travels left → right, repeat */
        gsap.killTweensOf(borderLightRef.current)
        gsap.fromTo(borderLightRef.current,
          { left: '-45%' },
          { left: '100%', duration: 0.7, ease: 'power1.inOut', repeat: -1, delay: 0 }
        )
        break
    }
  }

  const onMouseLeave = () => {
    const card = cardRef.current
    if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    qGX.current?.(0)
    qGY.current?.(0)
    if (spotRef.current) spotRef.current.style.opacity = '0'
    if (cardRef.current) cardRef.current.style.borderTopColor = `${accent}30`
    if (prefersReducedMotion()) return

    switch (index) {
      case 0:
        gsap.to(ghostRef.current, { opacity: 0.10, scale: 1, duration: 0.4 })
        break
      case 1:
        gsap.killTweensOf(lockIconRef.current)
        gsap.killTweensOf(lockShackleRef.current)
        gsap.set(lockIconRef.current, { opacity: 0, y: 0, rotation: 0 })
        gsap.set(lockShackleRef.current, { attr: { d: 'M10 14 Q10 4 16 4 Q22 4 22 14' } })
        break
      case 3:
        gsap.killTweensOf(borderLightRef.current)
        gsap.set(borderLightRef.current, { left: '-45%' })
        break
    }
  }

  return (
    <div
      ref={cardRef}
      data-principle-card=""
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: 'var(--space-8)',
        background: 'var(--color-bg-base)',
        border: '1px solid var(--color-border)',
        borderTop: `2px solid ${accent}30`,
        borderRadius: 'var(--radius-xl)',
        height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
        cursor: 'default', willChange: 'transform',
        transition: 'border-top-color 0.3s',
      }}
    >
      {/* Spotlight */}
      <div ref={spotRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0, borderRadius: 'inherit',
        transition: 'opacity 0.3s',
      }} />

      {/* Principle 2: scan line */}
      {index === 2 && (
        <div ref={scanRef} aria-hidden="true" style={{
          position: 'absolute', left: 0, right: 0, height: '1.5px',
          background: `linear-gradient(90deg, transparent, ${accent}CC, transparent)`,
          top: '-2px', pointerEvents: 'none', zIndex: 2,
        }} />
      )}

      {/* Principle 3: traveling border light */}
      {index === 3 && (
        <div ref={borderLightRef} aria-hidden="true" style={{
          position: 'absolute', top: '-1px', height: '3px', width: '45%',
          background: `linear-gradient(90deg, transparent, ${accent}DD, transparent)`,
          pointerEvents: 'none', zIndex: 2, left: '-45%',
        }} />
      )}

      {/* Principle 1: padlock that breaks free */}
      {index === 1 && (
        <svg
          ref={lockIconRef}
          aria-hidden="true"
          width="32" height="32"
          viewBox="0 0 32 32"
          fill="none"
          style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0 }}
        >
          <rect x="6" y="14" width="20" height="16" rx="2"
            fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
          <path
            ref={lockShackleRef}
            d="M10 14 Q10 4 16 4 Q22 4 22 14"
            stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none"
          />
          <circle cx="16" cy="22" r="2" fill={accent} opacity="0.7" />
          <rect x="15" y="23" width="2" height="3" rx="1" fill={accent} opacity="0.7" />
        </svg>
      )}

      {/* Ghost ordinal number */}
      <span ref={ghostRef} aria-hidden="true" style={{
        position: 'absolute', bottom: '-1.5rem', right: '-0.5rem',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(5rem,9vw,8rem)', lineHeight: 1,
        color: accent, opacity: 0.10,
        pointerEvents: 'none', userSelect: 'none',
        willChange: 'transform',
      }}>
        {principle.ordinal}
      </span>

      {/* Ordinal badge */}
      <span style={{
        position: 'relative', zIndex: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px',
        fontFamily: 'var(--font-mono)', fontWeight: 800,
        fontSize: 'var(--text-xs)', color: accent,
        background: accentDim,
        border: `1px solid ${accent}40`,
        borderRadius: 'var(--radius-md)',
      }}>
        {index + 1}
      </span>

      <h3 style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
        lineHeight: 'var(--leading-snug)',
      }}>
        {principle.name}
      </h3>

      <p style={{
        position: 'relative', zIndex: 1,
        fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)',
        color: 'var(--color-text-tertiary)', marginTop: 'auto',
      }}>
        {principle.statement}
      </p>
    </div>
  )
}

export function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('[data-principle-card]')
      if (!cards) return
      gsap.fromTo(cards,
        { y: 50, opacity: 0, rotateX: 10, transformOrigin: 'top center' },
        { y: 0, opacity: 1, rotateX: 0, transformOrigin: 'top center',
          duration: 0.9, ease: EASE.entrance,
          stagger: { each: 0.1 },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="principles"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-content)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ maxWidth: '560px', marginBottom: 'var(--section-gap)' }}>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
            }}>Our principles</p>
          </FadeUp>
          <WordReveal as="h2" style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
          }}>
            Four non-negotiables.
          </WordReveal>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-5)',
        }}>
          {principles.map((p, i) => (
            <PrincipleCard
              key={p.ordinal}
              principle={p}
              accent={ACCENTS[i % ACCENTS.length]}
              accentDim={ACCENT_DIMS[i % ACCENT_DIMS.length]}
              index={i}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
