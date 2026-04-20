'use client'

import { useRef, useEffect, useState } from 'react'
import { useIsTablet } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { metrics } from '@/content/metrics'
import { CountUp } from '@/components/animation/CountUp'

function parseMetric(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+\.?\d*)(.*)$/)
  if (!match) return { num: 0, suffix: value }
  return { num: parseFloat(match[1]), suffix: match[2] ?? '' }
}

const METRIC_DETAILS = [
  'Real shipped commits. Every one tracked in the public GitHub.',
  'Unit, integration, E2E. Zero mocked databases.',
  'Graph query, entity extract, agent memory, credential broker + more.',
  'Composable, observable, on-prem, test-driven. Non-negotiable.',
  'Local dev, self-hosted, cloud-agnostic Docker.',
  'Every inference call stays inside your perimeter.',
]

const ACCENTS = ['#4361EE', '#8B5CF6', '#22C55E', '#F97316', '#06B6D4', '#EAB308']

/* ── Mini-visualization SVGs per metric index ────────────────────── */
const ANIM_SELECTOR = '[data-dot],[data-bar],[data-mcp-node],[data-mcp-edge],[data-check],[data-check-bg],[data-layer-rect],[data-layer-text],[data-shield],[data-lock]'

function MiniVis({ index, accent, isActive }: { index: number; accent: string; isActive: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || prefersReducedMotion()) return

    /* Always kill + reset first so re-hover starts clean */
    const all = svg.querySelectorAll(ANIM_SELECTOR)
    gsap.killTweensOf(all)

    if (!isActive) {
      gsap.set(all, { opacity: 0, clearProps: 'transform,y,scale' })
      return
    }

    switch (index) {
      case 0: {
        const dots = svg.querySelectorAll('[data-dot]')
        gsap.fromTo(dots,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.2, ease: EASE.emphasis, stagger: { each: 0.018, from: 'random' } }
        )
        break
      }
      case 1: {
        /* bars: animate opacity + slight y offset — no scaleY (needs transform-box workaround) */
        const bars = svg.querySelectorAll('[data-bar]')
        gsap.fromTo(bars,
          { opacity: 0, y: 6 },
          { opacity: 0.85, y: 0, duration: 0.32, ease: 'power2.out', stagger: 0.055 }
        )
        break
      }
      case 2: {
        const nodes = svg.querySelectorAll('[data-mcp-node]')
        const edges = svg.querySelectorAll('[data-mcp-edge]')
        gsap.fromTo(nodes, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: EASE.emphasis, stagger: 0.04 })
        gsap.fromTo(edges, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.25, stagger: 0.04 })
        break
      }
      case 3: {
        /* circles pop in, then check paths draw */
        gsap.fromTo(svg.querySelectorAll('[data-check-bg]'),
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.22, ease: EASE.emphasis, stagger: 0.08 }
        )
        svg.querySelectorAll('[data-check]').forEach((p, idx) => {
          const len = (p as SVGPathElement).getTotalLength?.() ?? 20
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
          gsap.to(p, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out', delay: 0.1 + idx * 0.08 })
        })
        break
      }
      case 4: {
        /* layers fade in bottom-to-top stagger */
        const rects = svg.querySelectorAll('[data-layer-rect]')
        const texts = svg.querySelectorAll('[data-layer-text]')
        gsap.fromTo(rects,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out', stagger: { each: 0.12, from: 'end' } }
        )
        gsap.fromTo(texts,
          { opacity: 0 },
          { opacity: 0.8, duration: 0.3, ease: 'power2.out', stagger: { each: 0.12, from: 'end' }, delay: 0.1 }
        )
        break
      }
      case 5: {
        const shield = svg.querySelector('[data-shield]')
        const lock = svg.querySelector('[data-lock]')
        gsap.fromTo(shield, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: EASE.emphasis })
        gsap.fromTo(lock, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.2 })
        break
      }
    }
  }, [isActive, index])

  const dim = `${accent}18`
  const mid = `${accent}60`

  if (index === 0) {
    const cols = 11, rows = 8
    return (
      <svg ref={svgRef} width="100%" height="44" viewBox={`0 0 ${cols * 10} ${rows * 5 + 4}`} aria-hidden="true" style={{ display: 'block' }}>
        {Array.from({ length: cols * rows }, (_, k) => (
          <circle
            key={k}
            data-dot=""
            cx={2 + (k % cols) * 10}
            cy={2 + Math.floor(k / cols) * 5}
            r="1.5"
            fill={accent}
            opacity="0"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' } as React.CSSProperties}
          />
        ))}
      </svg>
    )
  }

  if (index === 1) {
    /* 6 bars: normal viewBox, bottom at y=44, opacity starts at 0 */
    const heights = [28, 40, 24, 44, 32, 36]
    const baseY = 44
    return (
      <svg ref={svgRef} width="100%" height="48" viewBox="0 0 72 48" aria-hidden="true" style={{ display: 'block' }}>
        {heights.map((h, k) => (
          <rect
            key={k}
            data-bar=""
            x={k * 12 + 2}
            y={baseY - h}
            width="8"
            height={h}
            rx="2"
            fill={accent}
            opacity="0"
          />
        ))}
      </svg>
    )
  }

  if (index === 2) {
    const nodePos = [
      { x: 36, y: 22 },
      { x: 12, y: 10 }, { x: 60, y: 10 },
      { x: 12, y: 34 }, { x: 60, y: 34 },
    ]
    const edges = [[0,1],[0,2],[0,3],[0,4],[1,3],[2,4]]
    return (
      <svg ref={svgRef} width="100%" height="44" viewBox="0 0 72 44" aria-hidden="true" style={{ display: 'block' }}>
        {edges.map(([a, b], k) => (
          <line
            key={k}
            data-mcp-edge=""
            x1={nodePos[a].x} y1={nodePos[a].y}
            x2={nodePos[b].x} y2={nodePos[b].y}
            stroke={mid}
            strokeWidth="1"
            opacity="0"
          />
        ))}
        {nodePos.map((p, k) => (
          <circle
            key={k}
            data-mcp-node=""
            cx={p.x} cy={p.y}
            r={k === 0 ? 6 : 4}
            fill={k === 0 ? `${accent}30` : dim}
            stroke={accent}
            strokeWidth="1.2"
            opacity="0"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' } as React.CSSProperties}
          />
        ))}
      </svg>
    )
  }

  if (index === 3) {
    const positions = [{ x: 8, y: 10 }, { x: 40, y: 10 }, { x: 8, y: 30 }, { x: 40, y: 30 }]
    return (
      <svg ref={svgRef} width="100%" height="44" viewBox="0 0 72 44" aria-hidden="true" style={{ display: 'block' }}>
        {positions.map((p, k) => (
          <g key={k}>
            <circle
              data-check-bg=""
              cx={p.x + 8} cy={p.y + 4} r="9"
              fill={dim}
              stroke={`${accent}40`}
              strokeWidth="1"
              opacity="0"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' } as React.CSSProperties}
            />
            {/* opacity="0" → GSAP sets to 1 before drawing */}
            <path
              data-check=""
              d={`M ${p.x + 3} ${p.y + 4} l 4 4 l 8 -8`}
              stroke={accent}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0"
            />
          </g>
        ))}
      </svg>
    )
  }

  if (index === 4) {
    /* 3 stacked deployment layers — individual data attrs for clean targeting */
    return (
      <svg ref={svgRef} width="100%" height="44" viewBox="0 0 72 44" aria-hidden="true" style={{ display: 'block' }}>
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect
              data-layer-rect=""
              x={4 + k * 5} y={38 - k * 14}
              width={64 - k * 10} height="10" rx="3"
              fill={dim} stroke={accent} strokeWidth="1.2"
              opacity="0"
            />
            <text
              data-layer-text=""
              x="36" y={38 - k * 14 + 7.5} textAnchor="middle"
              fontFamily="monospace" fontSize="7" fill={accent}
              opacity="0"
            >
              {['Docker', 'K8s', 'Bare Metal'][k]}
            </text>
          </g>
        ))}
      </svg>
    )
  }

  /* index 5: shield + lock */
  return (
    <svg ref={svgRef} width="100%" height="44" viewBox="0 0 72 44" aria-hidden="true" style={{ display: 'block' }}>
      <path
        data-shield=""
        d="M36 4 L58 12 L58 26 Q58 38 36 44 Q14 38 14 26 L14 12 Z"
        fill={dim} stroke={accent} strokeWidth="1.5"
        opacity="0"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' } as React.CSSProperties}
      />
      <g data-lock="" style={{ opacity: 0 }}>
        <rect x="30" y="22" width="12" height="10" rx="2" fill={`${accent}30`} stroke={accent} strokeWidth="1.2" />
        <path d="M32 22 Q32 16 36 16 Q40 16 40 22"
          stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="27" r="1.5" fill={accent} />
      </g>
    </svg>
  )
}

function MetricCard({ m, i, num, suffix, isActive, onActivate, compact }: {
  m: typeof metrics[number]
  i: number
  num: number
  suffix: string
  isActive: boolean
  onActivate: () => void
  compact?: boolean
}) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const spotRef    = useRef<HTMLDivElement>(null)
  const detailRef  = useRef<HTMLParagraphElement>(null)
  const numWrapRef = useRef<HTMLDivElement>(null)
  const accent     = ACCENTS[i % ACCENTS.length]

  /* Ambient breathing glow — staggered by card index */
  useEffect(() => {
    const el = numWrapRef.current
    if (!el || prefersReducedMotion()) return
    const anim = gsap.to(el, {
      filter: `drop-shadow(0 0 14px ${accent}70)`,
      duration: 2.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.65,
    })
    return () => { anim.kill() }
  }, [accent, i])

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    gsap.set(card, { transformPerspective: 900 })
    return () => gsap.killTweensOf(card)
  }, [])

  /* Animate detail in/out whenever isActive changes */
  useEffect(() => {
    const detail = detailRef.current
    if (!detail) return
    if (prefersReducedMotion()) { detail.style.opacity = isActive ? '1' : '0'; return }
    if (isActive) {
      gsap.fromTo(detail,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.3, ease: EASE.entrance, overwrite: true }
      )
    } else {
      gsap.to(detail, { opacity: 0, y: 4, duration: 0.2, ease: 'power2.in', overwrite: true })
    }
  }, [isActive])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    gsap.to(card, { rotateX: -(y - 0.5) * 12, rotateY: (x - 0.5) * 12, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${accent}28, transparent 60%)`
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
      data-metric=""
      onMouseMove={onMouseMove}
      onMouseEnter={onActivate}
      onMouseLeave={onMouseLeave}
      style={{
        padding: compact ? 'var(--space-6) var(--space-4)' : 'var(--space-8) var(--space-6)',
        border: compact ? '1px solid var(--color-border)' : undefined,
        borderLeft: !compact && i > 0 ? '1px solid var(--color-border)' : undefined,
        textAlign: 'center',
        position: 'relative',
        cursor: 'default',
        willChange: 'transform',
        overflow: 'hidden',
        borderRadius: compact ? 'var(--radius-md)' : undefined,
      }}
    >
      {/* Spotlight */}
      <div ref={spotRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0, transition: 'opacity 0.3s',
      }} />

      <div
        ref={numWrapRef}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'var(--text-4xl)', lineHeight: 1,
          letterSpacing: 'var(--tracking-tighter)', marginBottom: '0.5rem',
          fontVariantNumeric: 'tabular-nums',
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <CountUp to={num} suffix={suffix} duration={1.8} delay={i * 0.08} />
      </div>

      <p style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-3)',
      }}>{m.label}</p>

      {/* Detail text */}
      <p ref={detailRef} style={{
        position: 'relative', zIndex: 1,
        fontSize: '11px', color: accent,
        lineHeight: '1.5',
        maxWidth: '160px', margin: '0 auto',
        opacity: 0,
        minHeight: '2.75em',
      }}>
        {METRIC_DETAILS[i]}
      </p>

      {/* Mini visualization — container opacity is the authoritative visibility guard */}
      <div style={{
        position: 'relative', zIndex: 1,
        marginTop: 'var(--space-3)',
        minHeight: '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.18s',
      }}>
        <MiniVis index={i} accent={accent} isActive={isActive} />
      </div>

      {/* Bottom accent line */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: '25%', right: '25%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accent}50, transparent)`,
      }} />
    </div>
  )
}

export function MetricsSection() {
  const sectionRef     = useRef<HTMLElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const isUserHovering = useRef(false)
  const cycleIdxRef    = useRef(0)
  const isTablet = useIsTablet()

  /* Scroll entrance */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('[data-metric]')
      if (!items) return
      gsap.from(items, {
        y: 24, opacity: 0,
        duration: 0.7, ease: EASE.entrance,
        stagger: { each: 0.1, from: 'start' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* Auto-cycle through metrics every 3.5s when section is in view and not hovered */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      if (!isUserHovering.current) {
        cycleIdxRef.current = (cycleIdxRef.current + 1) % metrics.length
        setHoveredIdx(cycleIdxRef.current)
      }
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="metrics"
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-void)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-16) var(--section-padding-x)',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(67,97,238,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: 'var(--max-w-content)', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isTablet
            ? 'repeat(2, 1fr)'
            : `repeat(${metrics.length}, 1fr)`,
          gap: isTablet ? '1px' : 0,
        }}
        onMouseLeave={() => {
          isUserHovering.current = false
          setHoveredIdx(null)
        }}
      >
        {metrics.map((m, i) => {
          const { num, suffix } = parseMetric(m.value)
          return (
            <MetricCard
              key={m.label} m={m} i={i} num={num} suffix={suffix}
              isActive={hoveredIdx === i}
              compact={isTablet}
              onActivate={() => {
                isUserHovering.current = true
                setHoveredIdx(i)
              }}
            />
          )
        })}
      </div>
    </section>
  )
}
