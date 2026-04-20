'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { analysisFamilies } from '@/content/analysis-families'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'

const ACCENTS = [
  { color: '#4361EE', dim: 'rgba(67,97,238,0.1)',   border: 'rgba(67,97,238,0.3)'  },
  { color: '#8B5CF6', dim: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)' },
  { color: '#06B6D4', dim: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.3)'  },
  { color: '#22C55E', dim: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'  },
  { color: '#F97316', dim: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)' },
  { color: '#EAB308', dim: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.3)'  },
  { color: '#A855F7', dim: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)' },
  { color: '#EF4444', dim: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'  },
]

const FAMILY_CHIPS = [
  ['Centrality', 'Clustering Coeff', 'Graph Density', 'Bottlenecks'],
  ['Coverage %', 'Gap Detection', 'Entity Heatmap', 'Missing Links'],
  ['Trend Lines', 'Forecasting', 'Growth Curves', 'Risk Signals'],
  ['Root Cause', 'Counterfactual', 'Impact Chains', 'Causal Graphs'],
  ['Temporal Drift', 'Staleness Score', 'Version Delta', 'Recency'],
  ['Community', 'Leiden Clusters', 'Hierarchy', 'Bridge Nodes'],
  ['Embeddings', 'Similarity', 'Behavior Gap', 'Semantic Drift'],
  ['Inference Chains', 'Logic Gaps', 'Reasoning Depth', 'Evidence Map'],
]

/* ── Single accordion card ──────────────────────────────────────── */
function AnalysisCard({
  family,
  accent,
  isActive,
  isLocked,
  index,
  onHover,
  onLock,
}: {
  family: typeof analysisFamilies[number]
  accent: typeof ACCENTS[number]
  isActive: boolean
  isLocked: boolean
  index: number
  onHover: () => void
  onLock:  () => void
}) {
  const contentRef      = useRef<HTMLDivElement>(null)
  const chipsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    if (prefersReducedMotion()) {
      content.style.opacity = isActive ? '1' : '0'
      return
    }

    gsap.killTweensOf(content)
    if (isActive) {
      gsap.fromTo(content,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: EASE.entrance, delay: 0.42 }
      )
      gsap.fromTo(chipsContainerRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.28, delay: 0.62, ease: 'power2.out' }
      )
    } else {
      gsap.set(content, { opacity: 0, y: 0 })
      gsap.set(chipsContainerRef.current, { opacity: 0, y: 0 })
    }
  }, [isActive])

  return (
    <div
      data-analysis-card=""
      onMouseEnter={onHover}
      onClick={onLock}
      style={{
        flex: isActive ? '1 1 0' : '0 0 56px',
        minWidth: isActive ? '280px' : undefined,
        maxWidth: isActive ? undefined : '56px',
        overflow: 'hidden', position: 'relative',
        padding: `var(--space-6) ${isActive ? 'var(--space-8)' : 'var(--space-4)'}`,
        background: `linear-gradient(180deg, ${accent.dim} 0%, rgba(13,13,26,0.95) 100%)`,
        border: `1px solid ${isActive ? accent.border : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'flex 0.45s cubic-bezier(0.4,0,0.2,1), min-width 0.45s cubic-bezier(0.4,0,0.2,1), max-width 0.45s cubic-bezier(0.4,0,0.2,1), padding 0.35s, border-color 0.3s',
      }}
    >
      {/* Always-visible: number + label */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-5)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 800,
          fontSize: isActive ? 'var(--text-2xl)' : 'var(--text-sm)',
          color: accent.color, lineHeight: 1,
          transition: 'font-size 0.3s',
        }}>
          {String(family.number).padStart(2, '0')}
        </span>

        {isActive ? (
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)',
            lineHeight: 'var(--leading-snug)',
          }}>
            {family.name}
          </h3>
        ) : (
          <span style={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: '11px', color: 'rgba(255,255,255,0.32)',
            whiteSpace: 'nowrap', maxHeight: '140px',
            overflow: 'hidden', letterSpacing: '0.08em',
          }}>
            {family.name}
          </span>
        )}
      </div>

      {/* Expanded content */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
          lineHeight: 'var(--leading-relaxed)', fontStyle: 'italic',
          marginBottom: 'var(--space-4)',
          paddingBottom: 'var(--space-4)',
          borderBottom: `1px solid ${accent.border}`,
        }}>
          {family.oneliner}
        </p>
        <p style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
          lineHeight: 'var(--leading-relaxed)',
        }}>
          {family.description}
        </p>

        {/* Chips */}
        <div ref={chipsContainerRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'var(--space-4)', opacity: 0 }}>
          {(FAMILY_CHIPS[index] ?? []).map((chip) => (
            <span key={chip} style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              color: accent.color, background: accent.dim,
              border: `1px solid ${accent.border}`,
              borderRadius: 'var(--radius-full)', padding: '0.18rem 0.55rem',
              whiteSpace: 'nowrap',
            }}>{chip}</span>
          ))}
        </div>
      </div>

        {/* Accent glow at bottom */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
          background: `linear-gradient(to top, ${accent.dim.replace('0.1', '0.25')}, transparent)`,
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          pointerEvents: 'none',
        }} />

      {/* Top accent line — solid when active, dashed when locked-but-not-hovered */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px', background: isActive ? accent.color : isLocked ? `${accent.color}60` : 'transparent',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: isActive ? `0 0 12px ${accent.color}` : 'none',
      }} />

      {/* Locked indicator dot */}
      {isLocked && (
        <div aria-hidden="true" style={{
          position: 'absolute', top: '0.75rem', right: '0.6rem',
          width: '5px', height: '5px', borderRadius: '50%',
          background: accent.color, opacity: 0.7,
          boxShadow: `0 0 6px ${accent.color}`,
        }} />
      )}
    </div>
  )
}

/* ── Section ─────────────────────────────────────────────────────── */
export function AnalysisSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const [lockedIdx, setLockedIdx] = useState(0)
  const [activeIdx,  setActiveIdx]  = useState(-1)

  /* Auto-expand first card after 900ms */
  useEffect(() => {
    if (prefersReducedMotion()) { setActiveIdx(0); return }
    const t = setTimeout(() => setActiveIdx(0), 900)
    return () => clearTimeout(t)
  }, [])

  /* Scroll entrance — accordion flies in as unit */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 40, opacity: 0,
        duration: 0.8, ease: EASE.entrance,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="analysis"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-void)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        overflowX: 'hidden',
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
              }}>Stage 3 — Analyze</p>
            </FadeUp>
            <WordReveal as="h2" style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
            }}>
              Eight ways to see what your graph knows.
            </WordReveal>
          </div>
          <FadeUp>
            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)',
            }}>
              Click to lock an analysis type open. Hover to preview.
              Eight agents run in parallel — each finds a different class of training
              opportunity invisible to flat search.
            </p>
          </FadeUp>
        </div>

        {/* Horizontal accordion */}
        <div
          ref={containerRef}
          onMouseLeave={() => setActiveIdx(lockedIdx)}
          style={{
            display: 'flex', gap: 'var(--space-2)',
            height: '400px', alignItems: 'stretch',
            overflow: 'hidden', flexShrink: 0,
          }}
        >
          {analysisFamilies.map((family, i) => (
            <AnalysisCard
              key={family.number}
              family={family}
              accent={ACCENTS[i % ACCENTS.length]}
              isActive={i === activeIdx}
              isLocked={i === lockedIdx}
              index={i}
              onHover={() => setActiveIdx(i)}
              onLock={() => { setLockedIdx(i); setActiveIdx(i) }}
            />
          ))}
        </div>

        {/* Hint */}
        <p style={{
          marginTop: 'var(--space-4)',
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--color-text-muted)', textAlign: 'center',
          letterSpacing: 'var(--tracking-wide)',
        }}>
          Click to lock · Hover to preview · {analysisFamilies.length} analysis families
        </p>

      </div>
    </section>
  )
}
