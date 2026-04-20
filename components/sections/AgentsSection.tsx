'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { WordReveal } from '@/components/animation/WordReveal'
import { FadeUp } from '@/components/animation/FadeUp'
import { agents } from '@/content/agents'

const STAGE_PALETTE: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  'Connect':  { color: '#4361EE', bg: 'rgba(67,97,238,0.08)',   border: 'rgba(67,97,238,0.28)',  glow: 'rgba(67,97,238,0.25)' },
  'Structure':{ color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.28)', glow: 'rgba(139,92,246,0.25)' },
  'Analyze':  { color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.28)',  glow: 'rgba(6,182,212,0.25)' },
  'Research': { color: '#F97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.28)', glow: 'rgba(249,115,22,0.25)' },
  'Curate':   { color: '#22C55E', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.28)',  glow: 'rgba(34,197,94,0.25)' },
  'Select':   { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.28)', glow: 'rgba(59,130,246,0.25)' },
  'Train':    { color: '#A855F7', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.28)', glow: 'rgba(168,85,247,0.25)' },
  'Evaluate': { color: '#EAB308', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.28)',  glow: 'rgba(234,179,8,0.25)' },
  'Deploy':   { color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.28)', glow: 'rgba(16,185,129,0.25)' },
  'Monitor':  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.28)',  glow: 'rgba(239,68,68,0.25)' },
}

function AgentCard({ agent, palette }: {
  agent: typeof agents[number]
  palette: typeof STAGE_PALETTE[string]
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    gsap.set(card, { transformPerspective: 900 })
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
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${palette.glow}, transparent 60%)`
      spotRef.current.style.opacity = '1'
    }
  }

  const onMouseLeave = () => {
    const card = cardRef.current
    if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) spotRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={cardRef}
      data-agent-card=""
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: 'var(--space-5)',
        background: `linear-gradient(135deg, ${palette.bg} 0%, rgba(13,13,26,0.9) 100%)`,
        border: '1px solid var(--color-border)',
        borderLeft: `2px solid ${palette.border}`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'default',
        willChange: 'transform',
      }}
    >
      <div ref={spotRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0, borderRadius: 'inherit',
        transition: 'opacity 0.25s',
      }} />

      <h3 style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'var(--text-base)', color: 'var(--color-text-primary)',
        lineHeight: 'var(--leading-snug)', marginBottom: 'var(--space-2)',
      }}>
        {agent.name}
      </h3>
      <p style={{
        position: 'relative', zIndex: 1,
        fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-relaxed)',
        color: 'var(--color-text-tertiary)',
      }}>
        {agent.oneliner}
      </p>

      <div style={{
        position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
        width: '6px', height: '6px', borderRadius: '50%',
        backgroundColor: palette.color, opacity: 0,
        animation: 'pulse-ring 2.5s ease-in-out infinite',
      }} />
    </div>
  )
}

const PIPELINE_STAGES = [
  { name: 'Connect',  color: '#4361EE', num: 1 },
  { name: 'Structure',color: '#8B5CF6', num: 2 },
  { name: 'Analyze',  color: '#06B6D4', num: 3 },
  { name: 'Research', color: '#F97316', num: 4 },
  { name: 'Curate',   color: '#22C55E', num: 5 },
  { name: 'Select',   color: '#3B82F6', num: 6 },
  { name: 'Train',    color: '#A855F7', num: 7 },
  { name: 'Evaluate', color: '#EAB308', num: 8 },
  { name: 'Deploy',   color: '#10B981', num: 9 },
  { name: 'Monitor',  color: '#EF4444', num: 10 },
]

function PipelineBar({ activeStage, onSelect }: { activeStage: string | null; onSelect: (name: string | null) => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 0, marginBottom: 'var(--space-16)', flexWrap: 'nowrap',
      overflowX: 'auto',
    }}>
      {PIPELINE_STAGES.map((stage, i) => {
        const isActive = activeStage === stage.name
        return (
          <div key={stage.name} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Stage node */}
            <button
              onClick={() => onSelect(isActive ? null : stage.name)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              <div style={{
                width: isActive ? '44px' : '36px',
                height: isActive ? '44px' : '36px',
                borderRadius: '50%',
                background: isActive ? stage.color : `${stage.color}20`,
                border: `2px solid ${isActive ? stage.color : `${stage.color}50`}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isActive ? `0 0 20px ${stage.color}60` : 'none',
                transition: 'all 0.25s',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 800,
                  fontSize: isActive ? '12px' : '10px',
                  color: isActive ? '#fff' : stage.color,
                  lineHeight: 1,
                }}>{String(stage.num).padStart(2, '0')}</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                color: isActive ? stage.color : 'rgba(255,255,255,0.3)',
                letterSpacing: '0.05em', whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}>{stage.name}</span>
            </button>

            {/* Arrow connector between stages */}
            {i < PIPELINE_STAGES.length - 1 && (
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true">
                <line x1="0" y1="5" x2="14" y2="5"
                  stroke={`${stage.color}40`} strokeWidth="1.5" />
                <path d="M12 2 L16 5 L12 8" stroke={`${stage.color}40`} strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

const stageMap = new Map<string, typeof agents>()
for (const agent of agents) {
  const group = stageMap.get(agent.stage) ?? []
  group.push(agent)
  stageMap.set(agent.stage, group)
}
const stageGroups = Array.from(stageMap.entries())

export function AgentsSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const [activeStage, setActiveStage] = useState<string | null>(null)

  /* Scroll entrance */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll('[data-stage-group]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-agent-card]'), {
          y: 36, opacity: 0, scale: 0.96,
          duration: 0.7, ease: EASE.entrance,
          stagger: { each: 0.08 },
          scrollTrigger: { trigger: group, start: 'top 84%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* Stage filter — fade non-active groups */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const allGroups = section.querySelectorAll('[data-stage-group]')
    if (!activeStage) {
      gsap.to(allGroups, { opacity: 1, duration: 0.3 })
      return
    }
    allGroups.forEach((group) => {
      const isActive = group.getAttribute('data-stage-name') === activeStage
      gsap.to(group, { opacity: isActive ? 1 : 0.18, duration: 0.3 })
    })
  }, [activeStage])

  return (
    <section
      id="agents"
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
            }}>The team</p>
          </FadeUp>
          <WordReveal as="h2" style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
          }}>
            18 specialists. One team.
          </WordReveal>
          <FadeUp delay={0.2}>
            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)',
            }}>
              Click a stage to focus. Hover any card for 3D spotlight.
            </p>
          </FadeUp>
        </div>

        {/* Pipeline visualization */}
        <PipelineBar
          activeStage={activeStage}
          onSelect={setActiveStage}
        />

        {/* Stage groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {stageGroups.map(([stageName, stageAgents]) => {
            const palette   = STAGE_PALETTE[stageName] ?? STAGE_PALETTE['Connect']
            const isFiltered = activeStage !== null && activeStage !== stageName
            const isActive   = activeStage === stageName

            return (
              <div key={stageName} data-stage-group="" data-stage-name={stageName}>
                {/* Stage header — clickable filter */}
                <div
                  onClick={() => setActiveStage(isActive ? null : stageName)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                    marginBottom: 'var(--space-5)', cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                    fontWeight: 700, color: palette.color,
                    background: isActive ? palette.bg.replace('0.08', '0.18') : palette.bg,
                    border: `1px solid ${isActive ? palette.color : palette.border}`,
                    borderRadius: 'var(--radius-full)', padding: '0.3rem 0.875rem',
                    transition: 'background 0.2s, border-color 0.2s',
                    boxShadow: isActive ? `0 0 16px ${palette.color}40` : 'none',
                  }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      backgroundColor: palette.color,
                      boxShadow: isActive ? `0 0 6px ${palette.color}` : 'none',
                    }} />
                    Stage {stageAgents[0].stageNumber} · {stageName}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    color: isFiltered ? 'var(--color-text-muted)' : 'var(--color-text-muted)',
                    letterSpacing: 'var(--tracking-wide)',
                  }}>
                    {stageAgents.length} agent{stageAgents.length > 1 ? 's' : ''}
                  </span>
                  <div style={{
                    flex: 1, height: '1px',
                    background: `linear-gradient(to right, ${isActive ? palette.color : palette.border}, transparent)`,
                    transition: 'background 0.3s',
                  }} />
                  {/* Toggle indicator */}
                  {isActive && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px',
                      color: palette.color, letterSpacing: 'var(--tracking-wide)',
                    }}>click to reset</span>
                  )}
                </div>

                {/* Agent cards grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-3)',
                }}>
                  {stageAgents.map((agent) => (
                    <AgentCard key={agent.name} agent={agent} palette={palette} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
