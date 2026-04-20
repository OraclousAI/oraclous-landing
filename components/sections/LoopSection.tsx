'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { loopStages } from '@/content/loop-stages'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'

/* ── Precomputed node positions (CX=200, CY=200, R=155) ───────────── */
const CX = 200, CY = 200, R = 155
const NODE_POS = loopStages.map((_, i) => {
  const a = (-90 + i * 36) * (Math.PI / 180)
  return { x: Math.round(CX + R * Math.cos(a)), y: Math.round(CY + R * Math.sin(a)) }
})

/* re-entry arc from S10 (index 9) → S3 (index 2) through center */
const REENTRY = `M ${NODE_POS[9].x} ${NODE_POS[9].y} Q ${CX} ${CY} ${NODE_POS[2].x} ${NODE_POS[2].y}`

/* Arc length between adjacent nodes (36° of circle with R=155) */
const ARC_LEN = R * (2 * Math.PI / 10)

/* Stage accent colors (same as agents palette) */
const STAGE_COLORS = [
  '#4361EE','#8B5CF6','#06B6D4','#F97316','#22C55E',
  '#3B82F6','#A855F7','#EAB308','#10B981','#EF4444',
]

export function LoopSection() {
  const sectionRef         = useRef<HTMLElement>(null)
  const diagramRef         = useRef<HTMLDivElement>(null)
  const panelRef           = useRef<HTMLDivElement>(null)
  const scrollIdxRef       = useRef(0)
  const arcRef             = useRef<SVGPathElement>(null)
  const reentryParticleRef = useRef<SVGCircleElement>(null)
  const isHovering         = useRef(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const prevIdx      = useRef(0)

  /* Animate content panel on stage change */
  useEffect(() => {
    if (!panelRef.current || prefersReducedMotion()) return
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: EASE.entrance }
    )
    prevIdx.current = activeIdx
  }, [activeIdx])

  /* Scroll entrance on the SVG nodes */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const nodes = sectionRef.current?.querySelectorAll('[data-loop-node]')
      if (!nodes) return
      gsap.from(nodes, {
        scale: 0, opacity: 0,
        duration: 0.5, ease: EASE.emphasis,
        stagger: { each: 0.06 },
        transformOrigin: 'center center',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      /* Scroll-driven stage progression — snaps to nearest step */
      const proxy = { val: 0 }
      gsap.to(proxy, {
        val: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1800',
          pin: true,
          anticipatePin: 1,
          snap: {
            snapTo: (rawValue: number) => Math.round(rawValue * 10) / 10,
            duration: { min: 0.2, max: 0.5 },
            delay: 0,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            if (isHovering.current) return
            const raw = self.progress * 10
            const newIdx = Math.min(9, Math.max(0, Math.floor(raw)))
            if (newIdx !== scrollIdxRef.current) {
              scrollIdxRef.current = newIdx
              setActiveIdx(newIdx)
            }
            const intraStep = raw % 1
            if (arcRef.current) {
              arcRef.current.style.strokeDashoffset = String(ARC_LEN * (1 - intraStep))
            }
          },
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* Re-entry particle animation */
  useEffect(() => {
    const particle = reentryParticleRef.current
    if (!particle || prefersReducedMotion()) return

    // Quadratic bezier: P(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
    // P0 = NODE_POS[9], P1 = {CX, CY}, P2 = NODE_POS[2]
    const p0 = NODE_POS[9], p1 = { x: CX, y: CY }, p2 = NODE_POS[2]
    const bezier = (t: number) => {
      const mt = 1 - t
      return {
        x: Math.round(mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x),
        y: Math.round(mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y),
      }
    }

    const pts = [0, 0.2, 0.4, 0.6, 0.8, 1].map(bezier)

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 5 })
    tl.set(particle, { attr: { cx: pts[0].x, cy: pts[0].y }, opacity: 0 })
      .to(particle, { opacity: 0.9, duration: 0.4, ease: 'power2.out' })
      .to(particle, { attr: { cx: pts[1].x, cy: pts[1].y }, duration: 0.7, ease: 'none' }, '<0.1')
      .to(particle, { attr: { cx: pts[2].x, cy: pts[2].y }, duration: 0.7, ease: 'none' })
      .to(particle, { attr: { cx: pts[3].x, cy: pts[3].y }, duration: 0.7, ease: 'none' })
      .to(particle, { attr: { cx: pts[4].x, cy: pts[4].y }, duration: 0.7, ease: 'none' })
      .to(particle, { attr: { cx: pts[5].x, cy: pts[5].y }, opacity: 0, duration: 0.6, ease: 'power2.in' })

    return () => { tl.kill() }
  }, [])

  const handleNodeHover = useCallback((i: number) => {
    isHovering.current = true
    setActiveIdx(i)
  }, [])

  const stage  = loopStages[activeIdx]
  const color  = STAGE_COLORS[activeIdx]

  return (
    <section
      id="loop"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-base)',
        padding: 'var(--space-10) var(--section-padding-x)',
        height: '100svh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-content)', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: 'var(--space-8)' }}>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
            }}>The FTOps loop</p>
          </FadeUp>
          <WordReveal as="h2" style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
          }}>
            The loop that never stops.
          </WordReveal>
          <FadeUp delay={0.2}>
            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-tertiary)',
            }}>
              10 stages. Each handled by a specialist agent. Hover any node to explore.
              When Monitor detects drift, the loop re-enters at Stage 3 — automatically.
            </p>
          </FadeUp>
        </div>

        {/* Main: diagram + detail panel */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 420px',
          gap: 'var(--space-12)', alignItems: 'center',
          flex: 1, minHeight: 0,
        }}>

          {/* Left: Active stage detail */}
          <div ref={panelRef} style={{ opacity: 1 }}>
            {/* Stage badge */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                color: color,
                background: `${color}12`,
                border: `1px solid ${color}40`,
                borderRadius: 'var(--radius-full)', padding: '0.3rem 0.875rem',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, animation: 'pulse-ring 1.5s ease-in-out infinite' }} />
                Stage {stage.number} of 10
              </span>
            </div>

            {/* Stage number big */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontWeight: 800,
              fontSize: 'clamp(4rem,8vw,7rem)', lineHeight: 1,
              color, opacity: 0.15, letterSpacing: '-0.04em',
              marginBottom: '-1.5rem', userSelect: 'none',
            }} aria-hidden="true">
              {String(stage.number).padStart(2, '0')}
            </div>

            <h3 style={{
              position: 'relative', zIndex: 1,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'var(--text-3xl)', color: 'var(--color-text-primary)',
              lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-4)',
            }}>{stage.name}</h3>

            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)',
            }}>{stage.agentName}</p>

            <p style={{
              fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-secondary)', maxWidth: '420px',
              marginBottom: 'var(--space-8)',
            }}>{stage.description}</p>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {loopStages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { isHovering.current = true; setActiveIdx(i) }}
                  style={{
                    width: i === activeIdx ? '20px' : '6px',
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    background: i === activeIdx ? color : 'var(--color-border-strong)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'width 0.3s, background 0.3s',
                  }}
                  aria-label={`Stage ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Circular SVG diagram */}
          <div
            ref={diagramRef}
            onMouseLeave={() => { isHovering.current = false; setActiveIdx(scrollIdxRef.current) }}
            style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}
          >
            <svg viewBox="0 0 400 400" width="100%" style={{ display: 'block', overflow: 'visible' }}>
              {/* Outer track ring */}
              <circle cx={CX} cy={CY} r={R + 20} fill="none"
                stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Inner track ring */}
              <circle cx={CX} cy={CY} r={R - 20} fill="none"
                stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Main track */}
              <circle cx={CX} cy={CY} r={R} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

              {/* Completed arcs — fully painted for all stages before active */}
              {Array.from({ length: activeIdx }, (_, i) => {
                const a1 = (-90 + i * 36) * (Math.PI / 180)
                const a2 = (-90 + (i + 1) * 36) * (Math.PI / 180)
                const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1)
                const x2 = CX + R * Math.cos(a2), y2 = CY + R * Math.sin(a2)
                return (
                  <path key={i}
                    d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                    fill="none" stroke={STAGE_COLORS[i]} strokeWidth="2" opacity={0.55}
                  />
                )
              })}

              {/* Current arc — partially painted via strokeDashoffset */}
              {(() => {
                const a1 = (-90 + activeIdx * 36) * (Math.PI / 180)
                const a2 = (-90 + ((activeIdx + 1) % 10) * 36) * (Math.PI / 180)
                const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1)
                const x2 = CX + R * Math.cos(a2), y2 = CY + R * Math.sin(a2)
                return (
                  <path
                    ref={arcRef}
                    d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                    fill="none" stroke={color} strokeWidth="3"
                    style={{
                      strokeDasharray: ARC_LEN,
                      strokeDashoffset: ARC_LEN,
                      filter: `drop-shadow(0 0 8px ${color})`,
                    }}
                  />
                )
              })()}

              {/* Re-entry arc S10 → S3 (dashed, through center) */}
              <path d={REENTRY} fill="none"
                stroke={STAGE_COLORS[9]} strokeWidth="2"
                strokeDasharray="5 4" opacity={0.65} />
              {/* Re-entry arrowhead near S3 */}
              <polygon
                points={`${NODE_POS[2].x - 6},${NODE_POS[2].y + 2} ${NODE_POS[2].x + 2},${NODE_POS[2].y - 6} ${NODE_POS[2].x + 2},${NODE_POS[2].y + 2}`}
                fill={STAGE_COLORS[9]} opacity={0.6}
              />

              {/* Re-entry particle */}
              <circle
                ref={reentryParticleRef}
                r="4"
                fill={STAGE_COLORS[9]}
                opacity="0"
                style={{
                  filter: `drop-shadow(0 0 6px ${STAGE_COLORS[9]})`,
                } as React.CSSProperties}
              />

              {/* Center label */}
              <text x={CX} y={CY - 10} textAnchor="middle"
                fontFamily="monospace" fontSize="9" letterSpacing="3"
                fill="rgba(255,255,255,0.18)" fontWeight="700">FTOPS</text>
              <text x={CX} y={CY + 6} textAnchor="middle"
                fontFamily="monospace" fontSize="9" letterSpacing="3"
                fill="rgba(255,255,255,0.18)" fontWeight="700">LOOP</text>
              <text x={CX} y={CY + 22} textAnchor="middle"
                fontFamily="monospace" fontSize="8" letterSpacing="1"
                fill="rgba(255,255,255,0.1)">10 STAGES</text>

              {/* Stage nodes */}
              {loopStages.map((stage, i) => {
                const pos = NODE_POS[i]
                const c   = STAGE_COLORS[i]
                const isActive = i === activeIdx
                const isAdj  = i === (activeIdx + 1) % 10 || i === (activeIdx + 9) % 10
                const nodeR  = isActive ? 18 : 13

                return (
                  <g
                    key={stage.number}
                    data-loop-node=""
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onMouseEnter={() => handleNodeHover(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer glow (active only) */}
                    {isActive && (
                      <circle r="26" fill={`${c}15`} stroke={c} strokeWidth="1" strokeOpacity="0.3" />
                    )}

                    {/* Node fill */}
                    <circle r={nodeR}
                      fill={isActive ? c : '#0D0D1A'}
                      stroke={isActive ? c : isAdj ? `${c}60` : 'rgba(255,255,255,0.1)'}
                      strokeWidth={isActive ? 2 : 1}
                      style={{ transition: 'r 0.3s, fill 0.3s, stroke 0.3s' }}
                      filter={isActive ? `url(#glow-${i})` : undefined}
                    />

                    {/* Glow filter definition */}
                    {isActive && (
                      <defs>
                        <filter id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                    )}

                    {/* Stage number text */}
                    <text textAnchor="middle" dominantBaseline="central"
                      fontFamily="monospace" fontWeight="700"
                      fontSize={isActive ? '10' : '8'}
                      fill={isActive ? '#fff' : isAdj ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)'}
                      style={{ pointerEvents: 'none', transition: 'fill 0.3s, font-size 0.3s' }}
                    >
                      {String(stage.number).padStart(2, '0')}
                    </text>

                    {/* Stage name label — always show, adjust opacity */}
                    {(() => {
                      const a = (-90 + i * 36) * (Math.PI / 180)
                      const lr = R + 32
                      const lx = Math.round(CX + lr * Math.cos(a)) - pos.x
                      const ly = Math.round(CY + lr * Math.sin(a)) - pos.y
                      return (
                        <text x={lx} y={ly}
                          textAnchor="middle" dominantBaseline="central"
                          fontFamily="monospace" fontSize="8"
                          fill={isActive ? c : 'rgba(255,255,255,0.38)'}
                          fontWeight={isActive ? '700' : '400'}
                          style={{ pointerEvents: 'none', transition: 'fill 0.3s, font-weight 0.3s' }}
                        >
                          {stage.name}
                        </text>
                      )
                    })()}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

      </div>
    </section>
  )
}
