'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { roadmapItems } from '@/content/roadmap-items'
import type { RoadmapStatus } from '@/types'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'
import { CountUp } from '@/components/animation/CountUp'

const STATUS_CONFIG: Record<RoadmapStatus, {
  label: string; color: string; bg: string; border: string; dot: string
}> = {
  shipped:       { label: 'Shipped',     color: '#22C55E', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.30)',  dot: '#22C55E' },
  'in-progress': { label: 'In Progress', color: '#EAB308', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.30)',  dot: '#EAB308' },
  committed:     { label: 'Committed',   color: '#4361EE', bg: 'rgba(67,97,238,0.08)',  border: 'rgba(67,97,238,0.30)',  dot: '#4361EE' },
}

const LAYER_CONFIG: Record<number, { label: string; color: string; border: string; bg: string }> = {
  1: { label: 'Knowledge Graph',  color: '#06B6D4', border: 'rgba(6,182,212,0.35)',  bg: 'rgba(6,182,212,0.08)'  },
  2: { label: 'Agent Framework',  color: '#8B5CF6', border: 'rgba(139,92,246,0.35)', bg: 'rgba(139,92,246,0.08)' },
  3: { label: 'FTOps Suite',      color: '#4361EE', border: 'rgba(67,97,238,0.35)',  bg: 'rgba(67,97,238,0.08)'  },
}

type StatusFilter = 'all' | RoadmapStatus
type LayerFilter  = 'all' | 1 | 2 | 3

const TIMELINE = [
  ...roadmapItems.filter(r => r.status === 'shipped'),
  ...roadmapItems.filter(r => r.status === 'in-progress'),
  ...roadmapItems.filter(r => r.status === 'committed'),
]

const SHIPPED_COUNT    = roadmapItems.filter(r => r.status === 'shipped').length
const IN_PROGRESS_COUNT = roadmapItems.filter(r => r.status === 'in-progress').length
const COMMITTED_COUNT  = roadmapItems.filter(r => r.status === 'committed').length
const TOTAL            = roadmapItems.length

export default function RoadmapPage() {
  const pageRef      = useRef<HTMLDivElement>(null)
  const lineRef      = useRef<HTMLDivElement>(null)
  const lineFillRef  = useRef<HTMLDivElement>(null)
  const itemsRef     = useRef<HTMLDivElement>(null)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [layerFilter,  setLayerFilter]  = useState<LayerFilter>('all')
  const [openIdx,      setOpenIdx]      = useState<number | null>(null)

  /* Initial entrance animations */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(lineFillRef.current, {
        scaleX: 0, transformOrigin: 'left center',
        duration: 1.6, ease: EASE.entrance, delay: 0.4,
      })
      gsap.from(lineRef.current, {
        scaleY: 0, transformOrigin: 'top center',
        duration: 1.6, ease: 'power1.inOut',
        scrollTrigger: { trigger: lineRef.current, start: 'top 80%', end: 'bottom 85%', scrub: 2 },
      })
      pageRef.current?.querySelectorAll('[data-timeline-item]').forEach((item) => {
        gsap.from(item, {
          x: -24, opacity: 0, duration: 0.55, ease: EASE.entrance,
          scrollTrigger: { trigger: item, start: 'top 90%' },
        })
      })
      pageRef.current?.querySelectorAll('[data-check-path]').forEach((path) => {
        const len = (path as SVGPathElement).getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(path, {
          strokeDashoffset: 0, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: path, start: 'top 92%' },
        })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* Filter animation */
  useEffect(() => {
    const container = itemsRef.current
    if (!container) return
    setOpenIdx(null)
    const allWrappers = container.querySelectorAll<HTMLDivElement>('[data-timeline-wrapper]')

    if (prefersReducedMotion()) {
      allWrappers.forEach((w) => {
        const matchStatus = statusFilter === 'all' || w.dataset.wrapperStatus === statusFilter
        const matchLayer  = layerFilter  === 'all' || w.dataset.wrapperLayer  === String(layerFilter)
        w.style.display = (matchStatus && matchLayer) ? '' : 'none'
      })
      return
    }

    allWrappers.forEach((w) => {
      const matchStatus = statusFilter === 'all' || w.dataset.wrapperStatus === statusFilter
      const matchLayer  = layerFilter  === 'all' || w.dataset.wrapperLayer  === String(layerFilter) || w.dataset.wrapperLayer === 'none'
      const visible     = matchStatus && matchLayer
      if (visible) {
        w.style.overflow = ''
        gsap.to(w, { height: 'auto', opacity: 1, duration: 0.32, ease: 'power2.out', clearProps: 'height,overflow' })
      } else {
        w.style.overflow = 'hidden'
        gsap.to(w, { height: 0, opacity: 0, duration: 0.24, ease: 'power2.in' })
      }
    })
  }, [statusFilter, layerFilter])

  /* Expand/collapse */
  useEffect(() => {
    const container = itemsRef.current
    if (!container) return
    const expandEls = container.querySelectorAll<HTMLDivElement>('[data-expand-panel]')
    expandEls.forEach((el, i) => {
      if (prefersReducedMotion()) {
        el.style.height  = i === openIdx ? 'auto' : '0'
        el.style.opacity = i === openIdx ? '1' : '0'
        return
      }
      if (i === openIdx) {
        gsap.fromTo(el,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.32, ease: 'power2.out', onComplete: () => ScrollTrigger.refresh() },
        )
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.22, ease: 'power2.in' })
      }
    })
  }, [openIdx])

  const visibleCount = TIMELINE.filter(item => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    const matchLayer  = layerFilter  === 'all' || item.layer  === (layerFilter as number)
    return matchStatus && matchLayer
  }).length

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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>Roadmap</span>
          </div>
        </FadeUp>

        <WordReveal as="h1" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)',
          color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)',
        }}>
          Where we are.
        </WordReveal>
        <WordReveal as="h1" delay={0.12} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)',
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 'var(--space-8)',
        }}>
          Where we&apos;re going.
        </WordReveal>

        <FadeUp delay={0.25}>
          <p style={{
            maxWidth: '560px',
            fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-tertiary)',
          }}>
            Not promises — production code with 58+ test suites. Every item below maps to a specific
            layer of the Oraclous platform: Knowledge Graph, Agent Framework, or FTOps Automation Suite.
          </p>
        </FadeUp>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <FadeUp delay={0.3}>
        <div style={{
          maxWidth: 'var(--max-w-content)', margin: '0 auto',
          padding: '0 var(--section-padding-x) var(--space-12)',
        }}>
          {/* Progress bar */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: 'var(--space-3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-2xl)', color: '#22C55E', lineHeight: 1,
                }}>
                  <CountUp to={SHIPPED_COUNT} duration={1.6} />
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
                }}>/ {TOTAL} shipped</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: '#22C55E', fontWeight: 700 }}>
                {Math.round((SHIPPED_COUNT / TOTAL) * 100)}%
              </span>
            </div>
            <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div ref={lineFillRef} style={{
                height: '100%', width: `${(SHIPPED_COUNT / TOTAL) * 100}%`,
                background: 'linear-gradient(90deg, #22C55E, #4ADE80)',
                borderRadius: 'var(--radius-full)', boxShadow: '0 0 12px rgba(34,197,94,0.5)',
              }} />
            </div>
          </div>

          {/* Three stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            {[
              { count: SHIPPED_COUNT,     label: 'Items Shipped',     cfg: STATUS_CONFIG.shipped },
              { count: IN_PROGRESS_COUNT, label: 'In Progress',       cfg: STATUS_CONFIG['in-progress'] },
              { count: COMMITTED_COUNT,   label: 'Committed',         cfg: STATUS_CONFIG.committed },
            ].map(({ count, label, cfg }) => (
              <div key={label} style={{
                padding: 'var(--space-5) var(--space-6)',
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-3xl)', color: cfg.color, lineHeight: 1,
                  marginBottom: 'var(--space-1)',
                }}>
                  <CountUp to={count} duration={1.4} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Filters ───────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
        padding: '0 var(--section-padding-x) var(--space-10)',
        display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {(['all', 'shipped', 'in-progress', 'committed'] as StatusFilter[]).map(key => {
            const cfg = key === 'all' ? null : STATUS_CONFIG[key as RoadmapStatus]
            const isActive = statusFilter === key
            return (
              <button key={key} type="button" onClick={() => setStatusFilter(key)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${isActive ? (cfg?.border ?? 'rgba(255,255,255,0.18)') : 'var(--color-border)'}`,
                  background: isActive ? (cfg?.bg ?? 'rgba(255,255,255,0.06)') : 'transparent',
                  color: isActive ? (cfg?.color ?? 'var(--color-text-primary)') : 'var(--color-text-muted)',
                }}
              >
                {key === 'all' ? 'All Status' : cfg!.label}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: 'var(--color-border)' }} />

        {/* Layer filters */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {(['all', 1, 2, 3] as LayerFilter[]).map(key => {
            const cfg = key === 'all' ? null : LAYER_CONFIG[key as number]
            const isActive = layerFilter === key
            return (
              <button key={String(key)} type="button" onClick={() => setLayerFilter(key)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${isActive ? (cfg?.border ?? 'rgba(255,255,255,0.18)') : 'var(--color-border)'}`,
                  background: isActive ? (cfg?.bg ?? 'rgba(255,255,255,0.06)') : 'transparent',
                  color: isActive ? (cfg?.color ?? 'var(--color-text-primary)') : 'var(--color-text-muted)',
                }}
              >
                {key === 'all' ? 'All Layers' : `L${key} · ${cfg!.label}`}
              </button>
            )
          })}
        </div>

        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
        }}>
          {visibleCount} item{visibleCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
        padding: '0 var(--section-padding-x) var(--space-24)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '0 var(--space-6)' }}>

          {/* Vertical line column */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              width: '1px', background: 'var(--color-border)', transform: 'translateX(-50%)',
            }} />
            <div ref={lineRef} style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              width: '2px', transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, #22C55E 0%, #22C55E 50%, #EAB308 65%, #4361EE 100%)',
              transformOrigin: 'top center',
            }} />
          </div>

          {/* Items column */}
          <div ref={itemsRef} style={{ display: 'flex', flexDirection: 'column' }}>
            {TIMELINE.map((item, i) => {
              const cfg = STATUS_CONFIG[item.status]
              const lcfg = item.layer ? LAYER_CONFIG[item.layer] : null
              const isPrevDifferent = i > 0 && TIMELINE[i - 1].status !== item.status
              const isNewGroup = i === 0 || isPrevDifferent
              const isOpen = openIdx === i

              return (
                <div
                  key={`${item.label}-${i}`}
                  data-timeline-wrapper=""
                  data-wrapper-status={item.status}
                  data-wrapper-layer={item.layer ?? 'none'}
                >
                  {/* Status group label */}
                  {isNewGroup && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                      marginTop: i === 0 ? 0 : 'var(--space-8)',
                      marginBottom: 'var(--space-4)',
                    }}>
                      <span style={{
                        position: 'relative', left: '-48px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '18px', height: '18px', borderRadius: '50%',
                        backgroundColor: cfg.dot,
                        boxShadow: `0 0 14px ${cfg.dot}, 0 0 28px ${cfg.dot}60`,
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                        letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                        color: cfg.color, fontWeight: 700,
                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                        borderRadius: 'var(--radius-full)', padding: '0.3rem 0.9rem',
                        marginLeft: '-28px',
                      }}>
                        {cfg.label}
                      </span>
                    </div>
                  )}

                  {/* Timeline row */}
                  <div
                    data-timeline-item=""
                    data-status={item.status}
                    style={{ paddingTop: 'var(--space-2)', paddingBottom: 'var(--space-2)', position: 'relative' }}
                  >
                    {/* Node dot */}
                    <div style={{
                      position: 'absolute', left: '-52px', top: '50%', transform: 'translateY(-50%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: item.status === 'shipped' ? cfg.dot : cfg.bg,
                      border: `1.5px solid ${cfg.dot}`,
                      boxShadow: item.status === 'shipped' ? `0 0 8px ${cfg.dot}90` : 'none',
                    }}>
                      {item.status === 'shipped' && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                          <path data-check-path="" d="M1 4l3 3 5-6"
                            stroke="#030305" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {item.status === 'in-progress' && (
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot }} />
                      )}
                    </div>

                    {/* Card */}
                    <div
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      style={{
                        padding: 'var(--space-4) var(--space-5)',
                        background: 'var(--color-bg-surface)',
                        border: `1px solid ${isOpen ? cfg.border : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)', cursor: 'pointer',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = cfg.border
                        e.currentTarget.style.boxShadow = `0 0 20px ${cfg.bg.replace('0.08', '0.12')}`
                      }}
                      onMouseLeave={e => {
                        if (!isOpen) e.currentTarget.style.borderColor = 'var(--color-border)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{
                          fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                          lineHeight: 'var(--leading-snug)', flex: 1,
                        }}>
                          {item.label}
                        </span>
                        {lcfg && (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: lcfg.color, background: lcfg.bg,
                            border: `1px solid ${lcfg.border}`,
                            borderRadius: 'var(--radius-sm)', padding: '0.15rem 0.45rem',
                            flexShrink: 0, whiteSpace: 'nowrap',
                          }}>
                            L{item.layer}
                          </span>
                        )}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                          style={{
                            color: cfg.color, flexShrink: 0,
                            transition: 'transform 0.28s',
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                          }}>
                          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      {/* Expanded detail */}
                      <div data-expand-panel="" style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
                        <div style={{
                          paddingTop: 'var(--space-4)', marginTop: 'var(--space-3)',
                          borderTop: `1px solid ${cfg.border}`,
                          display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: cfg.color, background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.55rem',
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}>{cfg.label}</span>
                          {lcfg && item.layer && (
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: '10px',
                              color: lcfg.color, background: lcfg.bg,
                              border: `1px solid ${lcfg.border}`,
                              borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.55rem',
                              whiteSpace: 'nowrap', flexShrink: 0,
                            }}>Layer {item.layer} · {lcfg.label}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>

    </div>
  )
}
