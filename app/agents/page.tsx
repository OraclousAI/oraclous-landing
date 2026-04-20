'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { agents } from '@/content/agents'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'

const STAGE_PALETTE: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  'Connect':  { color: '#4361EE', bg: 'rgba(67,97,238,0.08)',   border: 'rgba(67,97,238,0.28)',  glow: 'rgba(67,97,238,0.22)' },
  'Structure':{ color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.28)', glow: 'rgba(139,92,246,0.22)' },
  'Analyze':  { color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.28)',  glow: 'rgba(6,182,212,0.22)' },
  'Research': { color: '#F97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.28)', glow: 'rgba(249,115,22,0.22)' },
  'Curate':   { color: '#22C55E', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.28)',  glow: 'rgba(34,197,94,0.22)' },
  'Select':   { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.28)', glow: 'rgba(59,130,246,0.22)' },
  'Train':    { color: '#A855F7', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.28)', glow: 'rgba(168,85,247,0.22)' },
  'Evaluate': { color: '#EAB308', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.28)',  glow: 'rgba(234,179,8,0.22)' },
  'Deploy':   { color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.28)', glow: 'rgba(16,185,129,0.22)' },
  'Monitor':  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.28)',  glow: 'rgba(239,68,68,0.22)' },
}

const ALL_STAGES = ['All', 'Connect', 'Structure', 'Analyze', 'Research', 'Curate', 'Select', 'Train', 'Evaluate', 'Deploy', 'Monitor']

function AgentCard({ agent, onSelect }: {
  agent: typeof agents[number]
  onSelect: (agent: typeof agents[number]) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const palette = STAGE_PALETTE[agent.stage]

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    gsap.set(card, { transformPerspective: 900 })
    return () => { gsap.killTweensOf(card) }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top)  / rect.height
    gsap.to(card, { rotateX: -(y - 0.5) * 12, rotateY: (x - 0.5) * 12, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${palette.glow}, transparent 60%)`
      spotRef.current.style.opacity = '1'
    }
  }, [palette.glow])

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) spotRef.current.style.opacity = '0'
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => onSelect(agent)}
      style={{
        position: 'relative', cursor: 'pointer',
        padding: 'var(--space-6)',
        background: 'var(--color-bg-surface)',
        border: `1px solid var(--color-border)`,
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = palette.border
        e.currentTarget.style.boxShadow = `0 0 32px ${palette.glow}`
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = palette.border
        e.currentTarget.style.boxShadow = `0 0 32px ${palette.glow}`
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Cursor spotlight */}
      <div ref={spotRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, opacity: 0,
        transition: 'opacity 0.3s', pointerEvents: 'none', borderRadius: 'inherit',
      }} />

      {/* Stage badge + number */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
          color: palette.color, background: palette.bg,
          border: `1px solid ${palette.border}`,
          borderRadius: 'var(--radius-full)', padding: '0.2rem 0.6rem',
        }}>
          Stage {agent.stageNumber} · {agent.stage}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
          style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: '2px' }}>
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-2)', lineHeight: 'var(--leading-snug)',
      }}>
        {agent.name}
      </h3>

      {/* One-liner */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)',
        letterSpacing: '0.01em',
      }}>
        {agent.oneliner}
      </p>
    </div>
  )
}

function AgentModal({ agent, onClose }: {
  agent: typeof agents[number]
  onClose: () => void
}) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef    = useRef<HTMLDivElement>(null)
  const palette     = STAGE_PALETTE[agent.stage]

  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' })
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 32, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: EASE.entrance },
    )
  }, [])

  const close = useCallback(() => {
    if (prefersReducedMotion()) { onClose(); return }
    gsap.to(panelRef.current,    { opacity: 0, y: 20, scale: 0.97, duration: 0.25, ease: 'power2.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: onClose })
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [close])

  return (
    <div
      ref={backdropRef}
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 'var(--z-modal)' as any,
        backgroundColor: 'rgba(3,3,5,0.82)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
    >
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '560px', width: '100%',
          background: 'var(--color-bg-elevated)',
          border: `1px solid ${palette.border}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          boxShadow: `0 0 60px ${palette.glow}, 0 24px 48px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Close */}
        <button
          type="button" onClick={close} aria-label="Close"
          style={{
            position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem',
            color: 'var(--color-text-muted)', transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Stage badge */}
        <span style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
          color: palette.color, background: palette.bg,
          border: `1px solid ${palette.border}`,
          borderRadius: 'var(--radius-full)', padding: '0.25rem 0.75rem',
          marginBottom: 'var(--space-5)',
        }}>
          Stage {agent.stageNumber} · {agent.stage}
        </span>

        {/* Name */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)',
          lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-2)',
        }}>
          {agent.name}
        </h2>

        {/* One-liner */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: palette.color, letterSpacing: '0.01em',
          marginBottom: 'var(--space-6)',
        }}>
          {agent.oneliner}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${palette.border}, transparent)`, marginBottom: 'var(--space-6)' }} />

        {/* Description */}
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
        }}>
          {agent.description}
        </p>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const pageRef       = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState('All')
  const [selected,    setSelected]    = useState<typeof agents[number] | null>(null)

  const filtered = activeStage === 'All' ? agents : agents.filter(a => a.stage === activeStage)

  /* Grid entrance on filter change */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const cards = pageRef.current?.querySelectorAll('[data-agent-card]')
    if (!cards?.length) return
    gsap.fromTo(cards,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: EASE.entrance, stagger: 0.04 },
    )
  }, [activeStage])

  return (
    <div ref={pageRef} style={{ backgroundColor: 'var(--color-bg-void)', minHeight: '100vh' }}>

      {/* ── Page Hero ─────────────────────────────────────────────── */}
      <div style={{
        padding: '120px var(--section-padding-x) var(--space-16)',
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
      }}>
        <FadeUp>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <Link href="/" style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
              color: 'var(--color-text-muted)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              Oraclous
            </Link>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>Agent Team</span>
          </div>
        </FadeUp>

        <WordReveal as="h1" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)',
          color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)',
        }}>
          18 specialists.
        </WordReveal>
        <WordReveal as="h1" delay={0.12} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)',
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 'var(--space-8)',
        }}>
          One autonomous loop.
        </WordReveal>

        <FadeUp delay={0.25}>
          <p style={{
            maxWidth: '560px',
            fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-tertiary)',
          }}>
            Each agent owns a specific stage of the fine-tuning lifecycle — from ingesting your data
            to monitoring the deployed model for drift. No handoffs. No humans required.
          </p>
        </FadeUp>
      </div>

      {/* ── Pipeline strip ────────────────────────────────────────── */}
      <FadeUp delay={0.3}>
        <div style={{
          maxWidth: 'var(--max-w-content)', margin: '0 auto',
          padding: '0 var(--section-padding-x) var(--space-12)',
        }}>
          <div style={{
            display: 'flex', gap: '2px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '4px', overflow: 'auto',
          }}>
            {ALL_STAGES.map((stage) => {
              const palette = stage === 'All' ? null : STAGE_PALETTE[stage]
              const isActive = activeStage === stage
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setActiveStage(stage)}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                    padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)',
                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    background: isActive ? (palette?.bg ?? 'rgba(255,255,255,0.07)') : 'transparent',
                    color: isActive ? (palette?.color ?? 'var(--color-text-primary)') : 'var(--color-text-muted)',
                    boxShadow: isActive && palette ? `0 0 12px ${palette.glow}` : 'none',
                  }}
                >
                  {stage}
                </button>
              )
            })}
          </div>
        </div>
      </FadeUp>

      {/* ── Agent grid ────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
        padding: '0 var(--section-padding-x) var(--space-24)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
          }}>
            {filtered.length} agent{filtered.length !== 1 ? 's' : ''}
            {activeStage !== 'All' && ` · ${activeStage}`}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {filtered.map((agent) => (
            <div key={agent.name} data-agent-card="">
              <AgentCard agent={agent} onSelect={setSelected} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      {selected && (
        <AgentModal agent={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
