'use client'

import { useRef, useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { WordReveal } from '@/components/animation/WordReveal'
import { FadeUp } from '@/components/animation/FadeUp'

const WHAT_IT_MEANS = [
  {
    letter: 'F',
    term: 'Fine-Tuning',
    def: 'Domain-specific model adaptation. Not prompting. Not RAG. Actual weight updates on your compute.',
    expanded: 'QLoRA, LoRA, DPO, ORPO — target any of 15 Hugging Face adapter configs. Every training run stays on your GPU cluster. Zero API calls to Anthropic, OpenAI, or anyone else. Your weights, your data, your perimeter.',
    chips: ['QLoRA', 'LoRA', 'DPO', 'ORPO', '15 adapter configs'],
    accent: '#4361EE',
    accentDim: 'rgba(67,97,238,0.08)',
    accentBorder: 'rgba(67,97,238,0.25)',
  },
  {
    letter: 'T',
    term: 'Training Ops',
    def: 'The operational discipline of running fine-tuning reliably at scale — versioning, evaluation, rollback, monitoring.',
    expanded: 'Git-versioned training configs. RAGAS evaluation gates before any promotion. Automatic rollback if scores regress below baseline. Full audit trail from raw data to deployed weights, with human approval at every stage that matters.',
    chips: ['Git Versioned', 'RAGAS Gates', 'Auto Rollback', 'HITL Approval', 'Audit Trail'],
    accent: '#8B5CF6',
    accentDim: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.25)',
  },
  {
    letter: 'Ops',
    term: 'DevOps model',
    def: 'Continuous integration applied to model improvement. Every new piece of knowledge triggers a training candidate. Every deployment is gated by evaluation.',
    expanded: 'New knowledge enters the graph → 18 analysis agents surface training opportunities → HITL approval queue → LoRA adapter trained → RAGAS evaluated → staged deployment. After your one-time approval, no humans needed in the loop.',
    chips: ['Knowledge Graph', '18 Agents', 'HITL Queue', 'RAGAS Eval', 'Staged Deploy'],
    accent: '#22C55E',
    accentDim: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.25)',
  },
] as const

function FTOpsRow({ item, index, isOpen, onToggle }: {
  item: typeof WHAT_IT_MEANS[number]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const rowRef      = useRef<HTMLDivElement>(null)
  const spotRef     = useRef<HTMLDivElement>(null)
  const expandRef   = useRef<HTMLDivElement>(null)
  const letterRef   = useRef<HTMLSpanElement>(null)
  // biome-ignore lint/suspicious/noExplicitAny
  const pulseAnim = useRef<any>(null)
  const isMobile = useIsMobile()
  const { letter, term, def, expanded, chips, accent, accentDim, accentBorder } = item

  useEffect(() => {
    const row = rowRef.current
    if (!row || prefersReducedMotion()) return
    gsap.set(row, { transformPerspective: 1400 })

    /* Staggered letter glow pulse: F@0s, T@1.2s, Ops@2.4s */
    pulseAnim.current = gsap.to(letterRef.current, {
      textShadow: `0 0 22px ${accent}DD`,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: index * 1.2,
    })

    return () => {
      pulseAnim.current?.kill()
      gsap.killTweensOf(row)
    }
  }, [accent, index])

  /* Animate expand/collapse + border intensify */
  useEffect(() => {
    const el = expandRef.current
    if (!el) return

    /* Border intensify on open */
    if (!prefersReducedMotion()) {
      gsap.to(rowRef.current, {
        borderLeftColor: isOpen ? accent : `${accent}40`,
        duration: 0.3, ease: 'power2.out',
      })
    }

    if (prefersReducedMotion()) {
      el.style.height = isOpen ? 'auto' : '0'
      el.style.opacity = isOpen ? '1' : '0'
      return
    }

    if (isOpen) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        {
          height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out',
          onComplete: () => {
            const chipEls = el.querySelectorAll('[data-chip]')
            gsap.fromTo(chipEls,
              { opacity: 0, y: 8, scale: 0.88 },
              { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: EASE.emphasis, stagger: 0.065 }
            )
          },
        }
      )
    } else {
      /* Reset chips before collapse so they're fresh for next open */
      const chipEls = el.querySelectorAll('[data-chip]')
      gsap.set(chipEls, { opacity: 0, y: 0, scale: 1 })
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: 'power2.in' })
    }
  }, [isOpen, accent])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const row = rowRef.current
    if (!row) return
    const rect = row.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    gsap.to(row, { rotateX: -(y - 0.5) * 6, rotateY: (x - 0.5) * 6, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${accentDim.replace('0.08', '0.30')}, transparent 55%)`
      spotRef.current.style.opacity = '1'
    }
  }

  const onMouseLeave = () => {
    const row = rowRef.current
    if (row) gsap.to(row, { rotateX: 0, rotateY: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) spotRef.current.style.opacity = '0'
    if (rowRef.current) rowRef.current.style.boxShadow = 'none'
  }

  return (
    <div
      ref={rowRef}
      data-ftops-row=""
      onClick={onToggle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${accentDim} 0%, rgba(13,13,26,0.6) 100%)`,
        borderTop: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        borderLeft: `3px solid ${accent}40`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        willChange: 'transform',
        transition: 'box-shadow 0.25s',
      }}
      onMouseEnter={() => {
        if (rowRef.current) rowRef.current.style.boxShadow = `0 0 40px ${accentDim.replace('0.08', '0.20')}`
      }}
    >
      {/* Spotlight */}
      <div ref={spotRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0, transition: 'opacity 0.3s', zIndex: 0,
      }} />

      {/* Always-visible header row */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : '160px 1fr auto',
        gap: isMobile ? 'var(--space-4)' : 'var(--space-8)',
        alignItems: isMobile ? 'flex-start' : 'center',
        padding: isMobile ? 'var(--space-5) var(--space-5)' : 'var(--space-6) var(--space-8)',
      }}>
        {isMobile ? (
          /* Mobile: letter + term inline, def below in expanded content */
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
            <span ref={letterRef} style={{
              fontFamily: 'var(--font-mono)', fontWeight: 800,
              fontSize: 'var(--text-xl)', color: accent,
              letterSpacing: '-0.02em', lineHeight: 1, flexShrink: 0,
            }}>{letter}</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-base)', color: 'var(--color-text-primary)',
              lineHeight: 'var(--leading-snug)',
            }}>{term}</span>
          </div>
        ) : (
          <>
            <div>
              <span ref={letterRef} style={{
                fontFamily: 'var(--font-mono)', fontWeight: 800,
                fontSize: 'var(--text-2xl)', color: accent,
                letterSpacing: '-0.02em', lineHeight: 1,
                display: 'block', marginBottom: '0.2rem',
              }}>{letter}</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}>{term}</span>
            </div>
            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)',
            }}>{def}</p>
          </>
        )}
        {/* Chevron — always last in the grid */}
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          aria-hidden="true"
          style={{
            color: accent, flexShrink: 0,
            transition: 'transform 0.3s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            marginTop: isMobile ? '0.2rem' : undefined,
          }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Expanded content */}
      <div
        ref={expandRef}
        style={{ height: 0, overflow: 'hidden', opacity: 0 }}
      >
        <div style={{
          position: 'relative', zIndex: 1,
          padding: isMobile
            ? `var(--space-5) var(--space-5) var(--space-5)`
            : `var(--space-5) var(--space-8) var(--space-6) calc(160px + var(--space-8) + var(--space-8))`,
          borderTop: `1px solid ${accentBorder}`,
        }}>
          {isMobile && (
            <p style={{
              fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
            }}>{def}</p>
          )}
          <p style={{
            fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-5)',
          }}>{expanded}</p>

          {/* Animated chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {chips.map((chip) => (
              <span
                key={chip}
                data-chip=""
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  letterSpacing: 'var(--tracking-wide)',
                  color: accent,
                  background: accentDim,
                  border: `1px solid ${accentBorder}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.65rem',
                  opacity: 0,
                  display: 'inline-block',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FTOpsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const rows = sectionRef.current?.querySelectorAll('[data-ftops-row]')
      if (!rows) return
      gsap.from(rows, {
        x: -40, opacity: 0,
        duration: 0.7, ease: EASE.entrance,
        stagger: { each: 0.12 },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="ftops"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-content)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: 'var(--section-gap)' }}>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
            }}>The discipline that was missing</p>
          </FadeUp>
          <WordReveal
            as="h2"
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-6)',
            }}
          >
            FTOps is what MLOps becomes when fine-tuning is continuous.
          </WordReveal>
          <FadeUp delay={0.2}>
            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)', maxWidth: '640px',
            }}>
              MLOps solved training infrastructure. FTOps solves the knowledge-to-weights pipeline.
              It's the discipline of continuously translating your organization's accumulated knowledge
              into model capability — automatically, verifiably, without vendor dependency.
            </p>
          </FadeUp>
        </div>

        {/* Orientation note */}
        <FadeUp delay={0.3}>
          <p style={{
            fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.01em',
            marginBottom: 'var(--space-5)',
            padding: 'var(--space-4) var(--space-6)',
            background: 'var(--color-accent-dim)',
            border: '1px solid var(--color-border-accent)',
            borderRadius: 'var(--radius-md)',
          }}>
            If you&apos;ve shipped MLOps: this is the same framework applied to weights instead of containers.
            If you haven&apos;t: the three-word version is &ldquo;DevOps for models.&rdquo; Click each row to expand.
          </p>
        </FadeUp>

        {/* Breakdown rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {WHAT_IT_MEANS.map((item, i) => (
            <FTOpsRow
              key={item.letter}
              item={item}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
