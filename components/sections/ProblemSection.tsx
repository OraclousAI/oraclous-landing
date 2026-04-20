'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { WordReveal } from '@/components/animation/WordReveal'
import { FadeUp } from '@/components/animation/FadeUp'
import { LineReveal } from '@/components/animation/LineReveal'

const PAINS = [
  {
    num: '01',
    title: 'Fine-tuning is still a manual process',
    body: 'Engineers spend weeks on dataset curation, training runs, and evaluation. Every cycle is a one-off script. Nothing is systematic. Nothing compounds.',
    accent: '#EF4444',
    accentDim: 'rgba(239,68,68,0.08)',
    accentBorder: 'rgba(239,68,68,0.25)',
  },
  {
    num: '02',
    title: 'Your knowledge is locked in silos',
    body: 'Docs, databases, code, and institutional knowledge live in disconnected places. Fine-tuning on a fraction of your knowledge produces a fraction of the capability.',
    accent: '#EAB308',
    accentDim: 'rgba(234,179,8,0.08)',
    accentBorder: 'rgba(234,179,8,0.25)',
  },
  {
    num: '03',
    title: 'Vendor SaaS means permanent dependency',
    body: 'Cloud fine-tuning services require data egress, force proprietary formats, and capture your model weights. You pay to build someone else\'s competitive advantage.',
    accent: '#F97316',
    accentDim: 'rgba(249,115,22,0.08)',
    accentBorder: 'rgba(249,115,22,0.25)',
  },
] as const

/*
  Per-card unique hover signatures:
  0 — Manual process   : a spinner that never completes (stuck loop)
  1 — Siloed knowledge : three nodes flash broken connection lines
  2 — Vendor lock      : padlock shackle snaps closed on hover
*/
function PainCard({ pain, index }: { pain: typeof PAINS[number]; index: number }) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const spotRef    = useRef<HTMLDivElement>(null)
  const ghostRef   = useRef<HTMLSpanElement>(null)
  const iconRef    = useRef<SVGSVGElement>(null)
  const line1Ref   = useRef<SVGLineElement>(null)
  const line2Ref   = useRef<SVGLineElement>(null)
  const shackleRef = useRef<SVGPathElement>(null)

  const { num, title, body, accent, accentDim, accentBorder } = pain

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    gsap.set(card, { transformPerspective: 1000 })
    return () => gsap.killTweensOf(card)
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top)  / rect.height
    gsap.to(card, { rotateX: -(y - 0.5) * 14, rotateY: (x - 0.5) * 14, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${accentDim.replace('0.08', '0.35')}, transparent 55%)`
      spotRef.current.style.opacity = '1'
    }
  }

  const onMouseEnter = () => {
    if (cardRef.current) cardRef.current.style.borderTopColor = accent
    if (ghostRef.current) gsap.to(ghostRef.current, { opacity: 0.14, scale: 1.15, duration: 0.5, ease: 'power2.out' })
    if (prefersReducedMotion()) return

    switch (index) {
      case 0:
        /* Spinner arc rotates endlessly — a process stuck in a loop */
        gsap.to(iconRef.current, { opacity: 1, duration: 0.3 })
        gsap.to(iconRef.current, { rotation: 360, duration: 1.2, ease: 'none', repeat: -1 })
        break
      case 1:
        /* Lines flicker toward nodes but fail to connect — silos */
        gsap.to(iconRef.current, { opacity: 1, duration: 0.3 })
        gsap.fromTo([line1Ref.current, line2Ref.current],
          { opacity: 0 },
          { opacity: 0.9, duration: 0.22, yoyo: true, repeat: 5, stagger: 0.09, ease: 'power1.inOut' }
        )
        break
      case 2:
        /* Padlock shackle drops closed — locking you in */
        gsap.to(iconRef.current, { opacity: 1, duration: 0.3 })
        gsap.to(shackleRef.current, {
          attr: { d: 'M14 22 Q14 8 20 8 Q26 8 26 22' },
          duration: 0.35, ease: 'back.out(1.5)',
        })
        break
    }
  }

  const onMouseLeave = () => {
    const card = cardRef.current
    if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) spotRef.current.style.opacity = '0'
    if (cardRef.current) cardRef.current.style.borderTopColor = accentBorder
    if (ghostRef.current) gsap.to(ghostRef.current, { opacity: 0.06, scale: 1, duration: 0.4 })
    if (prefersReducedMotion()) return

    switch (index) {
      case 0:
        gsap.killTweensOf(iconRef.current)
        gsap.to(iconRef.current, { opacity: 0, duration: 0.25 })
        break
      case 1:
        gsap.killTweensOf(line1Ref.current)
        gsap.killTweensOf(line2Ref.current)
        gsap.to(iconRef.current, { opacity: 0, duration: 0.3 })
        break
      case 2:
        gsap.to(shackleRef.current, {
          attr: { d: 'M14 22 Q14 8 20 8 Q26 8 26 16' },
          duration: 0.3, ease: 'power2.in',
        })
        gsap.to(iconRef.current, { opacity: 0, duration: 0.3, delay: 0.2 })
        break
    }
  }

  return (
    <div
      ref={cardRef}
      data-pain-card=""
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: 'var(--space-8)',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderTop: `2px solid ${accentBorder}`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'default',
        willChange: 'transform',
        transition: 'border-top-color 0.3s',
      }}
    >
      {/* Spotlight */}
      <div ref={spotRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0, borderRadius: 'inherit',
        transition: 'opacity 0.3s',
      }} />

      {/* Ghost number */}
      <span ref={ghostRef} aria-hidden="true" style={{
        position: 'absolute', top: '-0.25rem', right: '1rem',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(5rem, 10vw, 8rem)', lineHeight: 1,
        color: accent, opacity: 0.06,
        pointerEvents: 'none', userSelect: 'none',
        willChange: 'transform',
      }}>{num}</span>

      {/* Card 01: spinner that never completes */}
      {index === 0 && (
        <svg ref={iconRef} aria-hidden="true" width="40" height="40" viewBox="0 0 40 40"
          fill="none" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', opacity: 0 }}>
          <circle cx="20" cy="20" r="14" stroke={`${accent}25`} strokeWidth="2.5" />
          <circle cx="20" cy="20" r="14"
            stroke={accent} strokeWidth="2.5"
            strokeDasharray="22 66" strokeLinecap="round"
          />
        </svg>
      )}

      {/* Card 02: three isolated nodes with broken connection lines */}
      {index === 1 && (
        <svg ref={iconRef} aria-hidden="true" width="48" height="40" viewBox="0 0 48 40"
          fill="none" style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0 }}>
          <circle cx="10" cy="12" r="5" fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
          <circle cx="38" cy="12" r="5" fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
          <circle cx="24" cy="32" r="5" fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
          <line ref={line1Ref} x1="15" y1="12" x2="33" y2="12"
            stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" style={{ opacity: 0 }} />
          <line ref={line2Ref} x1="35" y1="16" x2="27" y2="28"
            stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" style={{ opacity: 0 }} />
        </svg>
      )}

      {/* Card 03: padlock — starts open, closes on hover */}
      {index === 2 && (
        <svg ref={iconRef} aria-hidden="true" width="40" height="40" viewBox="0 0 40 40"
          fill="none" style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0 }}>
          <rect x="12" y="22" width="16" height="13" rx="2"
            fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
          <path ref={shackleRef}
            d="M14 22 Q14 8 20 8 Q26 8 26 16"
            stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="28" r="2" fill={accent} opacity="0.7" />
          <rect x="19" y="29" width="2" height="3" rx="1" fill={accent} opacity="0.7" />
        </svg>
      )}

      <LineReveal delay={0.1} color={accentBorder} thickness={1} style={{ marginBottom: 'var(--space-6)' } as React.CSSProperties} />

      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
        color: accent, marginBottom: 'var(--space-4)',
      }}>{num}</p>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
        lineHeight: 'var(--leading-snug)', marginBottom: 'var(--space-4)',
      }}>{title}</h3>

      <p style={{
        fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)',
        color: 'var(--color-text-tertiary)',
      }}>{body}</p>
    </div>
  )
}

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('[data-pain-card]')
      if (!cards) return
      gsap.fromTo(cards,
        { y: 48, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1,
          duration: 0.8, ease: EASE.entrance,
          stagger: { each: 0.12 },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="problem"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-base)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-content)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: 'var(--section-gap)' }}>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
            }}>The problem</p>
          </FadeUp>
          <WordReveal
            as="h2"
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
            }}
          >
            Fine-tuning is broken by design.
          </WordReveal>
        </div>

        {/* Pain cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {PAINS.map((pain, i) => (
            <PainCard key={pain.num} pain={pain} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
