'use client'

import { useRef, useEffect, useState } from 'react'
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
  shipped:      { label: 'Shipped',      color: '#22C55E', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.30)',  dot: '#22C55E' },
  'in-progress': { label: 'In Progress', color: '#EAB308', bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.30)',  dot: '#EAB308' },
  committed:    { label: 'Committed',    color: '#4361EE', bg: 'rgba(67,97,238,0.08)',  border: 'rgba(67,97,238,0.30)',  dot: '#4361EE' },
}

const LAYER_LABELS: Record<number, string> = {
  1: 'Knowledge Graph Infrastructure',
  2: 'Agent Framework',
  3: 'FTOps Automation Suite',
}

const TIMELINE = [
  ...roadmapItems.filter(r => r.status === 'shipped'),
  ...roadmapItems.filter(r => r.status === 'in-progress'),
  ...roadmapItems.filter(r => r.status === 'committed'),
]

const SHIPPED_COUNT = roadmapItems.filter(r => r.status === 'shipped').length
const TOTAL = roadmapItems.length

type Filter = 'all' | RoadmapStatus
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',         label: 'All' },
  { key: 'shipped',     label: 'Shipped' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'committed',   label: 'Committed' },
]

export function RoadmapSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const lineRef      = useRef<HTMLDivElement>(null)
  const lineFillRef  = useRef<HTMLDivElement>(null)
  const itemsRef     = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  /* Scroll entrance + scrubbed line + checkmark draw-in */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      /* Progress bar */
      gsap.from(lineFillRef.current, {
        scaleX: 0, transformOrigin: 'left center',
        duration: 1.4, ease: EASE.entrance,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      /* Timeline line draws down */
      gsap.from(lineRef.current, {
        scaleY: 0, transformOrigin: 'top center',
        duration: 1.4, ease: 'power1.inOut',
        scrollTrigger: { trigger: lineRef.current, start: 'top 75%', end: 'bottom 80%', scrub: 1.5 },
      })

      /* Individual items slide in */
      sectionRef.current?.querySelectorAll('[data-timeline-item]').forEach((item) => {
        gsap.from(item, {
          x: -28, opacity: 0,
          duration: 0.6, ease: EASE.entrance,
          scrollTrigger: { trigger: item, start: 'top 88%' },
        })
      })

      /* Checkmark draw-in via strokeDashoffset */
      sectionRef.current?.querySelectorAll('[data-check-path]').forEach((path) => {
        const len = (path as SVGPathElement).getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: path, start: 'top 90%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* Filter animation — collapse non-matching items, reveal matching */
  useEffect(() => {
    const container = itemsRef.current
    if (!container) return
    setOpenIdx(null)

    const allWrappers = container.querySelectorAll<HTMLDivElement>('[data-timeline-wrapper]')

    if (prefersReducedMotion()) {
      allWrappers.forEach((w) => {
        w.style.display = (activeFilter === 'all' || w.dataset.wrapperStatus === activeFilter) ? '' : 'none'
      })
      return
    }

    if (activeFilter === 'all') {
      gsap.to(allWrappers, {
        height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out',
        clearProps: 'height,overflow',
      })
    } else {
      const nonMatching = container.querySelectorAll<HTMLDivElement>(`[data-timeline-wrapper]:not([data-wrapper-status="${activeFilter}"])`)
      const matching    = container.querySelectorAll<HTMLDivElement>(`[data-timeline-wrapper][data-wrapper-status="${activeFilter}"]`)
      nonMatching.forEach((w) => { w.style.overflow = 'hidden' })
      gsap.to(nonMatching, { height: 0, opacity: 0, duration: 0.28, ease: 'power2.in' })
      gsap.to(matching,    { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out', clearProps: 'height,overflow' })
    }
  }, [activeFilter])

  /* Expand / collapse animation */
  const toggleItem = (idx: number) => {
    const newIdx = openIdx === idx ? null : idx
    setOpenIdx(newIdx)
  }

  useEffect(() => {
    const container = itemsRef.current
    if (!container) return
    const expandEls = container.querySelectorAll<HTMLDivElement>('[data-expand-panel]')
    expandEls.forEach((el, i) => {
      if (prefersReducedMotion()) {
        el.style.height = i === openIdx ? 'auto' : '0'
        return
      }
      if (i === openIdx) {
        gsap.fromTo(el, { height: 0, opacity: 0 }, {
          height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out',
          onComplete: () => ScrollTrigger.refresh(),
        })
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' })
      }
    })
  }, [openIdx])

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-void)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-content)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: 'var(--space-12)' }}>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
            }}>Progress</p>
          </FadeUp>
          <WordReveal as="h2" style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
          }}>
            Where we are. Where we're going.
          </WordReveal>
          <FadeUp delay={0.2}>
            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)',
            }}>
              Not promises — production code with 58+ test suites.
            </p>
          </FadeUp>
        </div>

        {/* Shipped progress bar */}
        <FadeUp delay={0.1}>
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: 'var(--space-3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-2xl)', color: '#22C55E', lineHeight: 1,
                }}>
                  <CountUp to={SHIPPED_COUNT} duration={1.5} />
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
                }}> / {TOTAL} items shipped</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
                color: '#22C55E', fontWeight: 700,
              }}>{Math.round((SHIPPED_COUNT / TOTAL) * 100)}%</span>
            </div>
            <div style={{
              height: '6px', background: 'var(--color-border)',
              borderRadius: 'var(--radius-full)', overflow: 'hidden',
            }}>
              <div ref={lineFillRef} style={{
                height: '100%',
                width: `${(SHIPPED_COUNT / TOTAL) * 100}%`,
                background: 'linear-gradient(90deg, #22C55E, #4ADE80)',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 0 12px rgba(34,197,94,0.5)',
              }} />
            </div>
          </div>
        </FadeUp>

        {/* Filter buttons */}
        <div style={{
          display: 'flex', gap: 'var(--space-2)',
          marginBottom: 'var(--space-8)', flexWrap: 'wrap',
        }}>
          {FILTERS.map(({ key, label }) => {
            const cfg = key === 'all' ? null : STATUS_CONFIG[key as RoadmapStatus]
            const isActive = activeFilter === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  padding: '0.3rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isActive ? (cfg?.border ?? 'var(--color-border-strong)') : 'var(--color-border)'}`,
                  background: isActive ? (cfg?.bg ?? 'rgba(255,255,255,0.06)') : 'transparent',
                  color: isActive ? (cfg?.color ?? 'var(--color-text-primary)') : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Vertical timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '0 var(--space-6)' }}>

          {/* Left: animated vertical line */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              width: '1px', background: 'var(--color-border)',
              transform: 'translateX(-50%)',
            }} />
            <div ref={lineRef} style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              width: '2px', transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, #22C55E 0%, #22C55E 60%, #EAB308 70%, #4361EE 100%)',
              transformOrigin: 'top center',
            }} />
          </div>

          {/* Right: items */}
          <div ref={itemsRef} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {TIMELINE.map((item, i) => {
              const cfg = STATUS_CONFIG[item.status]
              const isPrevDifferent = i > 0 && TIMELINE[i - 1].status !== item.status
              const isNewGroup = i === 0 || isPrevDifferent
              const isOpen = openIdx === i

              return (
                <div key={`${item.label}-${i}`} data-timeline-wrapper="" data-wrapper-status={item.status}>
                  {/* Group label */}
                  {isNewGroup && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                      marginTop: i === 0 ? 0 : 'var(--space-6)',
                      marginBottom: 'var(--space-4)',
                      paddingTop: i === 0 ? 0 : 'var(--space-2)',
                    }}>
                      <span style={{
                        position: 'relative', left: '-48px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '16px', height: '16px', borderRadius: '50%',
                        backgroundColor: cfg.dot,
                        boxShadow: `0 0 12px ${cfg.dot}, 0 0 24px ${cfg.dot}60`,
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                        letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                        color: cfg.color, fontWeight: 700,
                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                        borderRadius: 'var(--radius-full)', padding: '0.25rem 0.75rem',
                        marginLeft: '-24px',
                      }}>
                        {cfg.label}
                      </span>
                    </div>
                  )}

                  {/* Timeline item */}
                  <div
                    data-timeline-item=""
                    data-status={item.status}
                    style={{
                      paddingTop: 'var(--space-2)', paddingBottom: 'var(--space-2)',
                      position: 'relative',
                    }}
                  >
                    {/* Dot in line column */}
                    <div style={{
                      position: 'absolute', left: '-52px', top: '50%', transform: 'translateY(-50%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: item.status === 'shipped' ? cfg.dot : cfg.bg,
                      border: `1.5px solid ${cfg.dot}`,
                      boxShadow: item.status === 'shipped' ? `0 0 6px ${cfg.dot}80` : 'none',
                      flexShrink: 0,
                    }}>
                      {item.status === 'shipped' && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                          <path
                            data-check-path=""
                            d="M1 4l3 3 5-6"
                            stroke="#030305"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Content card */}
                    <div
                      onClick={() => toggleItem(i)}
                      style={{
                        flex: 1, padding: 'var(--space-4) var(--space-5)',
                        background: 'var(--color-bg-surface)',
                        border: `1px solid ${isOpen ? cfg.border : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = cfg.border
                        e.currentTarget.style.boxShadow = `0 0 20px ${cfg.bg.replace('0.08', '0.15')}`
                      }}
                      onMouseLeave={(e) => {
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
                        {item.layer && (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)', padding: '0.1rem 0.35rem',
                            flexShrink: 0, whiteSpace: 'nowrap',
                          }}>L{item.layer}</span>
                        )}
                        {/* Chevron toggle */}
                        <svg
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                          aria-hidden="true"
                          style={{
                            color: cfg.color, flexShrink: 0,
                            transition: 'transform 0.3s',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        >
                          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      {/* Expandable detail */}
                      <div
                        data-expand-panel=""
                        style={{ height: 0, overflow: 'hidden', opacity: 0 }}
                      >
                        <div style={{
                          paddingTop: 'var(--space-3)',
                          marginTop: 'var(--space-3)',
                          borderTop: `1px solid ${cfg.border}`,
                          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: cfg.color, background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem',
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}>{cfg.label}</span>
                          {item.layer && (
                            <span style={{
                              fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                            }}>
                              {LAYER_LABELS[item.layer]}
                            </span>
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
    </section>
  )
}
