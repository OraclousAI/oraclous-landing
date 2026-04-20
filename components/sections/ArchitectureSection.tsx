'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { WordReveal } from '@/components/animation/WordReveal'
import { FadeUp } from '@/components/animation/FadeUp'

const LAYERS = [
  {
    num: 'L3',
    name: 'FTOps Agent Team',
    tagline: '18 specialist agents that automate the complete fine-tuning lifecycle.',
    chips: ['10-Stage Loop', 'HITL Gates', 'Retrain Scheduling', 'Drift Detection'],
    accent: '#4361EE',
    accentDim: 'rgba(67,97,238,0.08)',
    accentBorder: 'rgba(67,97,238,0.3)',
    accentGlow: '0 0 80px rgba(67,97,238,0.3), 0 0 40px rgba(67,97,238,0.15)',
    delay: 0,
  },
  {
    num: 'L2',
    name: 'Graph-Native Agent Framework',
    tagline: 'MCP-first agent infrastructure with memory, evaluation, and credential brokering.',
    chips: ['15+ MCP Tools', 'Agent Memory', 'RAGAS Eval', 'Credential Broker'],
    accent: '#8B5CF6',
    accentDim: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.3)',
    accentGlow: '0 0 80px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.15)',
    delay: 0.12,
  },
  {
    num: 'L1',
    name: 'Multi-Tenant Knowledge Graph',
    tagline: 'Neo4j-backed knowledge graph with bitemporal tracking, federation, and ReBAC access control.',
    chips: ['Neo4j', 'Bitemporal', 'Cross-Graph Federation', 'ReBAC ACL'],
    accent: '#22C55E',
    accentDim: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.3)',
    accentGlow: '0 0 80px rgba(34,197,94,0.3), 0 0 40px rgba(34,197,94,0.15)',
    delay: 0.24,
  },
] as const

/* ── Animated flow connector between layers ──────────────────────── */
function FlowConnector({ from, to, idx }: {
  from: typeof LAYERS[number]
  to:   typeof LAYERS[number]
  idx:  number
}) {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot || prefersReducedMotion()) return
    const anim = gsap.fromTo(dot,
      { y: -4, opacity: 0 },
      { y: 56, opacity: 1, duration: 1.4, ease: 'none', repeat: -1, delay: idx * 0.55,
        onRepeat: () => gsap.set(dot, { opacity: 0 }) }
    )
    return () => { anim.kill() }
  }, [idx])

  return (
    <div style={{
      position: 'relative', margin: '0 auto', width: '48px', height: '56px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* Gradient line */}
      <div data-connector-dash="" style={{
        position: 'absolute', top: 0, bottom: '12px', left: '50%',
        width: '2px', transform: 'translateX(-50%)',
        background: `linear-gradient(to bottom, ${from.accentBorder}, ${to.accentBorder})`,
      }} />
      {/* Flowing particle */}
      <div ref={dotRef} style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '6px', height: '6px', borderRadius: '50%',
        background: to.accent,
        boxShadow: `0 0 8px ${to.accent}, 0 0 16px ${to.accent}80`,
        pointerEvents: 'none',
      }} />
      {/* Chevron */}
      <svg
        width="14" height="9" viewBox="0 0 14 9" fill="none"
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
      >
        <path d="M1 1.5L7 7L13 1.5" stroke={to.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ── Single layer card with 3D tilt + spotlight + propagation glow ── */
function LayerCard({ layer, isHovered, isCascade, onHover, onLeave }: {
  layer:     typeof LAYERS[number]
  isHovered: boolean
  isCascade: boolean
  onHover:   () => void
  onLeave:   () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const { num, name, tagline, chips, accent, accentDim, accentBorder, accentGlow } = layer

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    gsap.set(card, { transformPerspective: 1400 })
    return () => gsap.killTweensOf(card)
  }, [])

  /* Propagation glow: hovered card gets full glow, layers it depends on get a dim cascade */
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    if (isHovered) {
      card.style.boxShadow = accentGlow
    } else if (isCascade) {
      card.style.boxShadow = `0 0 55px ${accent}35, inset 0 0 30px ${accent}12`
    } else {
      card.style.boxShadow = 'none'
    }
  }, [isHovered, isCascade, accentGlow, accent])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top)  / rect.height
    gsap.to(card, { rotateX: -(y - 0.5) * 8, rotateY: (x - 0.5) * 8, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${accentDim.replace('0.08', '0.28')}, transparent 55%)`
      spotRef.current.style.opacity = '1'
    }
  }

  const onMouseLeave = () => {
    const card = cardRef.current
    if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) spotRef.current.style.opacity = '0'
    onLeave()
  }

  return (
    <div
      ref={cardRef}
      data-layer-card=""
      onMouseMove={onMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      style={{
        display: 'grid', gridTemplateColumns: '72px 1fr auto',
        gap: 'var(--space-8)', alignItems: 'center',
        padding: 'var(--space-8)',
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${accentDim} 0%, rgba(13,13,26,0.95) 100%)`,
        border: `1px solid ${accentBorder}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 'var(--radius-xl)',
        transition: 'box-shadow 0.3s',
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {/* Spotlight */}
      <div ref={spotRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0, transition: 'opacity 0.3s', zIndex: 0,
        borderRadius: 'inherit',
      }} />

      {/* Layer badge */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '48px', height: '48px',
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          fontSize: 'var(--text-base)', color: accent,
          background: accentDim.replace('0.08', '0.15'),
          border: `1px solid ${accentBorder}`,
          borderRadius: 'var(--radius-md)',
        }}>{num}</span>
      </div>

      {/* Layer info */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
          marginBottom: '0.4rem',
        }}>{name}</h3>
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)',
          lineHeight: 'var(--leading-relaxed)',
        }}>{tagline}</p>
      </div>

      {/* Feature chips */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexWrap: 'wrap', gap: '0.375rem',
        justifyContent: 'flex-end', maxWidth: '280px',
      }}>
        {chips.map((chip) => (
          <span key={chip} style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            color: accent, background: accentDim,
            border: `1px solid ${accentBorder}`,
            borderRadius: 'var(--radius-full)', padding: '0.2rem 0.65rem',
            whiteSpace: 'nowrap',
          }}>{chip}</span>
        ))}
      </div>
    </div>
  )
}

export function ArchitectureSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-layer-card]', {
        x: -32, opacity: 0,
        duration: 0.8, ease: EASE.entrance,
        stagger: { each: 0.14 },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.from('[data-connector-dash]', {
        scaleY: 0, transformOrigin: 'top center',
        duration: 0.6, ease: EASE.entrance,
        stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="architecture"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-void)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-content)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-12)', alignItems: 'end',
          marginBottom: 'var(--section-gap)',
        }}>
          <div>
            <FadeUp>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
              }}>Platform architecture</p>
            </FadeUp>
            <WordReveal as="h2" style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
            }}>
              Three layers. Nothing missing.
            </WordReveal>
          </div>
          <FadeUp>
            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)',
            }}>
              Layer 1 is the knowledge foundation. Layer 2 is the agent runtime. Layer 3 is the
              fine-tuning automation. Each layer is independently useful. Together, they're unstoppable.
            </p>
          </FadeUp>
        </div>

        {/* Layers with animated connectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {LAYERS.map((layer, i) => (
            <div key={layer.num}>
              <LayerCard
                layer={layer}
                isHovered={hoveredIdx === i}
                /* cascade glow: hovering L3 (idx 0) also dims L2 (idx 1) and L1 (idx 2) */
                isCascade={hoveredIdx !== null && hoveredIdx < i}
                onHover={() => setHoveredIdx(i)}
                onLeave={() => setHoveredIdx(null)}
              />
              {i < LAYERS.length - 1 && (
                <FlowConnector from={LAYERS[i]} to={LAYERS[i + 1]} idx={i} />
              )}
            </div>
          ))}
        </div>

        <FadeUp delay={0.4}>
          <p style={{
            marginTop: 'var(--space-8)',
            fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)', textAlign: 'center',
            letterSpacing: 'var(--tracking-wide)',
          }}>
            Each layer ships independently · All three together form the complete FTOps platform
          </p>
        </FadeUp>

      </div>
    </section>
  )
}
