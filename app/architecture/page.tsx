'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'

const LAYERS = [
  {
    id: 'l3',
    num: 'L3',
    name: 'FTOps Agent Team',
    subtitle: 'The autonomous fine-tuning operation',
    tagline: '18 specialist agents that automate the complete fine-tuning lifecycle — from knowledge graph analysis to model deployment and drift monitoring.',
    accent: '#4361EE',
    accentDim: 'rgba(67,97,238,0.08)',
    accentBorder: 'rgba(67,97,238,0.28)',
    accentGlow: 'rgba(67,97,238,0.25)',
    chips: ['10-Stage Loop', 'HITL Gates', 'Retrain Scheduling', 'Drift Detection', 'LoRA / QLoRA / DPO', 'ORPO', 'RAGAS Gating'],
    details: [
      { label: 'Pipeline stages',   value: '10' },
      { label: 'Specialist agents', value: '18' },
      { label: 'Training methods',  value: 'SFT · LoRA · QLoRA · DPO · ORPO' },
      { label: 'HITL checkpoints',  value: 'Every stage gate' },
    ],
    deepDive: [
      {
        heading: 'The 10-Stage Loop',
        body: 'Every fine-tuning cycle follows a deterministic 10-stage pipeline: Connect → Structure → Analyze → Research → Curate → Select → Train → Evaluate → Deploy → Monitor. Each stage is owned by a dedicated agent. The loop re-enters at Stage 3 when the Monitor Agent detects drift above threshold.',
      },
      {
        heading: 'Human-in-the-Loop Gates',
        body: 'HITL approval UIs appear at every critical decision point — dataset review, strategy selection, training launch, deployment promotion. Operators can inspect, modify, or override agent decisions before proceeding. No stage advances without explicit approval unless you configure fully autonomous mode.',
      },
      {
        heading: 'Training Method Selection',
        body: 'The Strategy Agent (Stage 6) chooses the optimal training technique based on dataset characteristics, target capability, and compute constraints. Supported methods: SFT (supervised fine-tuning), LoRA, QLoRA, full fine-tune, DPO (direct preference optimization), and ORPO. Hyperparameters are generated, not guessed.',
      },
    ],
  },
  {
    id: 'l2',
    num: 'L2',
    name: 'Graph-Native Agent Framework',
    subtitle: 'The infrastructure agents run on',
    tagline: 'MCP-first agent infrastructure with persistent memory, RAGAS evaluation, credential brokering, and a visual no-code studio for building graph-native agent workflows.',
    accent: '#8B5CF6',
    accentDim: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.28)',
    accentGlow: 'rgba(139,92,246,0.25)',
    chips: ['15+ MCP Tools', 'Agent Memory', 'RAGAS Eval', 'Credential Broker', 'Visual Flow Studio', 'Standalone Product'],
    details: [
      { label: 'MCP tools',       value: '15+' },
      { label: 'Memory model',    value: 'Decay-weighted, graph-backed' },
      { label: 'Evaluation',      value: 'RAGAS framework' },
      { label: 'Auth',            value: 'Credential broker with key rotation' },
    ],
    deepDive: [
      {
        heading: 'MCP-First Architecture',
        body: 'Layer 2 exposes all platform capabilities as MCP (Model Context Protocol) tools. Agents call graph queries, run evaluations, manage credentials, and trigger training jobs through a standardized tool interface. This means any MCP-compatible agent runtime can plug in without platform-specific SDKs.',
      },
      {
        heading: 'Agent Memory with Decay Modeling',
        body: 'Each agent maintains a graph-backed memory store with time-decay weighting. Recent observations outweigh older ones unless explicitly marked as persistent. Memory is queryable across agents — the Evaluation Agent can read what the Training Agent learned about dataset quality in prior cycles.',
      },
      {
        heading: 'Visual Flow Studio',
        body: 'A no-code visual editor for building and debugging graph-native agent workflows. Drag agents onto a canvas, wire tool calls, configure HITL gates, and observe live execution. Workflows export to versioned YAML that runs identically in headless production mode.',
      },
    ],
  },
  {
    id: 'l1',
    num: 'L1',
    name: 'Multi-Tenant Knowledge Graph',
    subtitle: 'The data foundation everything builds on',
    tagline: 'Neo4j-backed knowledge graph with bitemporal tracking, cross-graph federation, and ReBAC access control. Your domain knowledge — structured, versioned, and queryable.',
    accent: '#22C55E',
    accentDim: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.28)',
    accentGlow: 'rgba(34,197,94,0.25)',
    chips: ['Neo4j', 'Bitemporal', 'Cross-Graph Federation', 'ReBAC ACL', 'Zero-Copy Versioning', 'SAME_AS Deduplication'],
    details: [
      { label: 'Database',          value: 'Neo4j (self-hosted)' },
      { label: 'Temporal model',    value: 'Bitemporal (event_time + ingestion_time)' },
      { label: 'Access control',    value: 'ReBAC with service accounts' },
      { label: 'Ingestion sources', value: 'Docs · DBs · APIs · Code · Webhooks' },
    ],
    deepDive: [
      {
        heading: 'Bitemporal Tracking',
        body: 'Every fact in the graph carries two timestamps: event_time (when it happened in the real world) and ingestion_time (when we learned about it). This separation enables historical queries ("what did we know as of March 3rd?"), contradiction detection between old and new sources, and fine-grained training data filtering by knowledge age.',
      },
      {
        heading: 'Zero-Copy Versioning',
        body: 'Graph snapshots are stored as immutable version pointers — no data duplication. Each fine-tuning cycle locks a graph version, ensuring training data is reproducible even as live data continues ingesting. Rollback is a pointer swap, not a restore operation.',
      },
      {
        heading: 'ReBAC Access Control',
        body: 'Relationship-based access control (ReBAC) governs which agents and tenants can read, write, or federate which graph regions. Service accounts with scoped permissions and automatic key rotation are managed through the credential broker in Layer 2. Zero data leakage between tenants.',
      },
    ],
  },
] as const

function LayerCard({
  layer,
  isActive,
  onClick,
}: {
  layer: typeof LAYERS[number]
  isActive: boolean
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    gsap.set(card, { transformPerspective: 1000 })
    return () => { gsap.killTweensOf(card) }
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        padding: 'var(--space-4)', cursor: 'pointer',
        background: isActive ? layer.accentDim : 'var(--color-bg-surface)',
        border: `1px solid ${isActive ? layer.accentBorder : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
        boxShadow: isActive ? `0 0 40px ${layer.accentGlow}` : 'none',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.borderColor = layer.accentBorder
          e.currentTarget.style.boxShadow = `0 0 24px ${layer.accentGlow}`
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase', color: layer.accent,
          background: layer.accentDim, border: `1px solid ${layer.accentBorder}`,
          borderRadius: 'var(--radius-full)', padding: '0.25rem 0.7rem',
        }}>
          {layer.num}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          style={{
            color: isActive ? layer.accent : 'var(--color-text-muted)',
            transition: 'color 0.2s, transform 0.3s',
            transform: isActive ? 'rotate(90deg)' : 'none',
          }}>
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)',
        lineHeight: 'var(--leading-snug)', marginBottom: 'var(--space-2)',
      }}>
        {layer.name}
      </h3>
      <p style={{
        fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.01em',
        marginBottom: 'var(--space-5)',
      }}>
        {layer.subtitle}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {layer.chips.map(chip => (
          <span key={chip} style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)', padding: '0.15rem 0.45rem',
          }}>
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ArchitecturePage() {
  const pageRef      = useRef<HTMLDivElement>(null)
  const detailRef    = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string>('l3')

  const activeLayer = LAYERS.find(l => l.id === activeId) ?? LAYERS[0]

  /* Animate detail panel on layer change */
  useEffect(() => {
    const panel = detailRef.current
    if (!panel || prefersReducedMotion()) return
    gsap.fromTo(panel,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.38, ease: EASE.entrance },
    )
  }, [activeId])

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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>Architecture</span>
          </div>
        </FadeUp>

        <WordReveal as="h1" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)',
          color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)',
        }}>
          Three layers.
        </WordReveal>
        <WordReveal as="h1" delay={0.12} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)',
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 'var(--space-8)',
        }}>
          One platform.
        </WordReveal>

        <FadeUp delay={0.25}>
          <p style={{
            maxWidth: '580px',
            fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-tertiary)',
          }}>
            Oraclous is built in three composable layers. Layer 1 stores your domain knowledge.
            Layer 2 gives agents the tools to act on it. Layer 3 runs the autonomous fine-tuning loop on top.
          </p>
        </FadeUp>
      </div>

      {/* ── Stack diagram + layer selector ────────────────────────── */}
      <FadeUp delay={0.3}>
        <div style={{
          maxWidth: 'var(--max-w-content)', margin: '0 auto',
          padding: '0 var(--section-padding-x) var(--space-6)',
        }}>
          {/* Visual stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: 'var(--space-10)' }}>
            {LAYERS.map((layer, i) => (
              <div
                key={layer.id}
                onClick={() => setActiveId(layer.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-6)',
                  background: activeId === layer.id ? layer.accentDim : 'var(--color-bg-surface)',
                  border: `1px solid ${activeId === layer.id ? layer.accentBorder : 'var(--color-border)'}`,
                  borderRadius: i === 0 ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-sm)'
                    : i === LAYERS.length - 1 ? 'var(--radius-sm) var(--radius-sm) var(--radius-lg) var(--radius-lg)'
                    : 'var(--radius-sm)',
                  cursor: 'pointer', transition: 'all 0.22s',
                  boxShadow: activeId === layer.id ? `0 0 24px ${layer.accentGlow}` : 'none',
                }}
                onMouseEnter={e => {
                  if (activeId !== layer.id) {
                    e.currentTarget.style.borderColor = layer.accentBorder
                    e.currentTarget.style.background = layer.accentDim
                  }
                }}
                onMouseLeave={e => {
                  if (activeId !== layer.id) {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.background = 'var(--color-bg-surface)'
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                    color: layer.accent, minWidth: '28px',
                  }}>
                    {layer.num}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 600,
                    fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
                  }}>
                    {layer.name}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {layer.chips.slice(0, 3).map(chip => (
                    <span key={chip} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px',
                      color: 'var(--color-text-muted)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)', padding: '0.1rem 0.4rem',
                    }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Two-column: layer cards + detail panel ─────────────────── */}
      <div style={{
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
        padding: '0 var(--section-padding-x) var(--space-24)',
        display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-8)',
        alignItems: 'flex-start',
      }}>

        {/* Layer cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'sticky', top: '88px' }}>
          {LAYERS.map(layer => (
            <LayerCard
              key={layer.id}
              layer={layer}
              isActive={activeId === layer.id}
              onClick={() => setActiveId(layer.id)}
            />
          ))}
        </div>

        {/* Detail panel */}
        <div ref={detailRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

          {/* Layer header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                color: activeLayer.accent, background: activeLayer.accentDim,
                border: `1px solid ${activeLayer.accentBorder}`,
                borderRadius: 'var(--radius-full)', padding: '0.3rem 0.85rem',
              }}>
                {activeLayer.num}
              </span>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${activeLayer.accentBorder}, transparent)` }} />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
              color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tighter)', marginBottom: 'var(--space-4)',
            }}>
              {activeLayer.name}
            </h2>
            <p style={{
              fontSize: 'var(--text-base)', color: 'var(--color-text-tertiary)',
              lineHeight: 'var(--leading-relaxed)', maxWidth: '520px',
            }}>
              {activeLayer.tagline}
            </p>
          </div>

          {/* Key facts grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)',
          }}>
            {activeLayer.details.map(({ label, value }) => (
              <div key={label} style={{
                padding: 'var(--space-4) var(--space-5)',
                background: activeLayer.accentDim,
                border: `1px solid ${activeLayer.accentBorder}`,
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)',
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
                  color: activeLayer.accent, fontWeight: 600,
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* All chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {activeLayer.chips.map(chip => (
              <span key={chip} style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wide)',
                color: activeLayer.accent, background: activeLayer.accentDim,
                border: `1px solid ${activeLayer.accentBorder}`,
                borderRadius: 'var(--radius-full)', padding: '0.3rem 0.75rem',
              }}>
                {chip}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          {/* Deep dive sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {activeLayer.deepDive.map(({ heading, body }) => (
              <div key={heading}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-3)',
                }}>
                  {heading}
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--leading-relaxed)', maxWidth: '560px',
                }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', paddingTop: 'var(--space-4)' }}>
            <Link href="/agents" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
              color: activeLayer.accent, textDecoration: 'none',
              border: `1px solid ${activeLayer.accentBorder}`,
              borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem',
              background: activeLayer.accentDim, transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 20px ${activeLayer.accentGlow}` }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
            >
              View agent team →
            </Link>
            <Link href="/roadmap" style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
              color: 'var(--color-text-muted)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              Roadmap →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
