'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'

const PRINCIPLES = [
  { label: 'Open Source',       color: '#4361EE', dim: 'rgba(67,97,238,0.1)',   border: 'rgba(67,97,238,0.3)',   tip: 'Platform, agents, and framework are fully open source. No black boxes.' },
  { label: 'No Vendor Lock-In', color: '#8B5CF6', dim: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', tip: 'Every artifact you produce is portable. Escape velocity is documented, not promised.' },
  { label: 'Data Ownership',    color: '#22C55E', dim: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   tip: 'Your data never leaves your infrastructure. Not to Oraclous. Not to anyone.' },
  { label: 'Self-Hosted',       color: '#F97316', dim: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)',  tip: 'Runs on your VPC, on-prem, or sovereign cloud. No egress. No external dependencies.' },
]

const LAYER_STATUS = [
  { label: 'Layer 1 available', color: '#22C55E' },
  { label: 'Layer 2 available', color: '#22C55E' },
  { label: 'Layer 3 — H2 2026', color: '#EAB308' },
]

const PRODUCTS = [
  {
    layer: 'Layer 1',
    name: 'Graph Intelligence',
    tagline: 'The knowledge graph infrastructure that powers everything.',
    description: 'A production-grade, multi-tenant knowledge graph on Neo4j. Ships with bitemporal tracking, cross-graph federation, LLM-driven entity extraction, and ReBAC access control. Use it standalone or as the foundation for Layers 2 and 3.',
    features: ['Multi-tenant Neo4j', 'Bitemporal (event_time / ingestion_time)', 'Cross-graph federation', 'ReBAC + Service Accounts', 'Document, DB, Code, Multimodal ingestion'],
    accent: '#22C55E',
    accentDim: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.25)',
    accentGlow: '0 0 60px rgba(34,197,94,0.15)',
    badge: 'Open Source · MIT',
    badgeColor: '#22C55E',
  },
  {
    layer: 'Layer 2',
    name: 'Agent Studio',
    tagline: 'The graph-native agent framework for production AI systems.',
    description: 'An MCP-first agent framework with 15+ tools, persistent memory with decay modeling, RAGAS evaluation, and a credential broker service. Build agents that think with your knowledge graph, not against it.',
    features: ['15+ MCP tools', 'Agent memory + decay', 'RAGAS evaluation', 'Credential broker', 'Visual Flow Studio (upcoming)'],
    accent: '#8B5CF6',
    accentDim: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.25)',
    accentGlow: '0 0 60px rgba(139,92,246,0.15)',
    badge: 'Open Source · MIT',
    badgeColor: '#8B5CF6',
  },
  {
    layer: 'Layer 3',
    name: 'FTOps Suite',
    tagline: 'The complete fine-tuning automation platform.',
    description: 'The full 10-stage loop, all 18 agents, HITL approval UIs, periodic retraining, drift monitoring, and every training technique from LoRA to DPO. The only FTOps platform that ships entirely on your infrastructure.',
    features: ['10-stage automation loop', '18 specialist agents', 'LoRA, QLoRA, DPO, ORPO', 'HITL approval UIs', 'Drift detection + auto-retrain'],
    accent: '#4361EE',
    accentDim: 'rgba(67,97,238,0.08)',
    accentBorder: 'rgba(67,97,238,0.25)',
    accentGlow: '0 0 60px rgba(67,97,238,0.15)',
    badge: 'Committed H2 2026',
    badgeColor: '#EAB308',
  },
] as const

function BackDiagram({ product }: { product: typeof PRODUCTS[number] }) {
  const { accent, layer } = product

  // L1: Knowledge Graph
  if (layer === 'Layer 1') {
    const nodes = [
      { x: 100, y: 30, label: 'Entity' },
      { x: 40,  y: 90, label: 'Doc' },
      { x: 160, y: 90, label: 'Code' },
      { x: 70,  y: 145, label: 'Concept' },
      { x: 140, y: 145, label: 'Event' },
    ]
    const edges: [number, number][] = [[0,1],[0,2],[0,3],[1,3],[2,4],[3,4]]
    return (
      <svg viewBox="0 0 200 160" width="180" height="144" fill="none">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={`${accent}40`} strokeWidth="1.5" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={i === 0 ? 16 : 12} fill={`${accent}20`} stroke={accent} strokeWidth={i === 0 ? 2 : 1.5} />
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central" fill={accent} fontSize="6" fontWeight="700" fontFamily="monospace">{n.label}</text>
          </g>
        ))}
      </svg>
    )
  }

  // L2: Agent-MCP Network
  if (layer === 'Layer 2') {
    const tools = ['Memory', 'Eval', 'Query', 'Ingest', 'Cred', 'MCP']
    return (
      <svg viewBox="0 0 200 160" width="180" height="144" fill="none">
        <circle cx="100" cy="80" r="20" fill={`${accent}25`} stroke={accent} strokeWidth="2" />
        <text x="100" y="81" textAnchor="middle" dominantBaseline="central" fill={accent} fontSize="7" fontWeight="700" fontFamily="monospace">AGENT</text>
        {tools.map((tool, i) => {
          const a = (i * 60) * (Math.PI / 180)
          const tx = Math.round(100 + 72 * Math.cos(a))
          const ty = Math.round(80 + 72 * Math.sin(a))
          return (
            <g key={i}>
              <line x1="100" y1="80" x2={tx} y2={ty} stroke={`${accent}35`} strokeWidth="1" strokeDasharray="3 2" />
              <circle cx={tx} cy={ty} r="14" fill={`${accent}15`} stroke={`${accent}60`} strokeWidth="1.5" />
              <text x={tx} y={ty + 1} textAnchor="middle" dominantBaseline="central" fill={`${accent}BB`} fontSize="5.5" fontFamily="monospace">{tool}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  // L3: 10-stage FTOps Loop
  const labels = ['C', 'S', 'A', 'R', 'Cur', 'Sel', 'T', 'E', 'D', 'M']
  const stageColors = ['#4361EE','#8B5CF6','#06B6D4','#F97316','#22C55E','#3B82F6','#A855F7','#EAB308','#10B981','#EF4444']
  return (
    <svg viewBox="0 0 200 180" width="180" height="162" fill="none">
      <circle cx="100" cy="90" r="68" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {labels.map((label, i) => {
        const a = (-90 + i * 36) * (Math.PI / 180)
        const x = Math.round(100 + 68 * Math.cos(a))
        const y = Math.round(90 + 68 * Math.sin(a))
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill={`${stageColors[i]}25`} stroke={stageColors[i]} strokeWidth="1.5" />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fill={stageColors[i]} fontSize="6.5" fontWeight="700" fontFamily="monospace">{label}</text>
          </g>
        )
      })}
      <text x="100" y="86" textAnchor="middle" fontFamily="monospace" fontSize="8" letterSpacing="2" fill="rgba(255,255,255,0.2)" fontWeight="700">FTOPS</text>
      <text x="100" y="99" textAnchor="middle" fontFamily="monospace" fontSize="8" letterSpacing="2" fill="rgba(255,255,255,0.2)" fontWeight="700">LOOP</text>
    </svg>
  )
}

function ProductCard({ product }: { product: typeof PRODUCTS[number] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const { layer, name, tagline, description, features, accent, accentDim, accentBorder, accentGlow, badge, badgeColor } = product

  useEffect(() => {
    const card = flipRef.current
    if (!card || prefersReducedMotion()) return
    return () => gsap.killTweensOf(card)
  }, [])

  const handleClick = () => {
    const newFlipped = !isFlipped
    setIsFlipped(newFlipped)
    gsap.to(flipRef.current, {
      rotateY: newFlipped ? 180 : 0,
      duration: 0.65,
      ease: 'power2.inOut',
    })
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return
    const card = flipRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    gsap.to(card, { rotateX: -(y - 0.5) * 10, rotateY: (x - 0.5) * 10, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${accentDim.replace('0.08', '0.28')}, transparent 55%)`
      spotRef.current.style.opacity = '1'
    }
  }

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFlipped) {
      const card = flipRef.current
      if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    }
    if (spotRef.current) spotRef.current.style.opacity = '0'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div
      ref={cardRef}
      style={{
        perspective: "1200px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={flipRef}
        data-product-card=""
        onClick={handleClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = accentGlow;
        }}
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          flex: 1,
          minHeight: "600px",
          willChange: "transform",
          cursor: "pointer",
          transition: "box-shadow 0.3s",
        }}
      >
        {/* Front face */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
            background: "var(--color-bg-surface)",
            border: `1px solid ${accentBorder}`,
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Spotlight */}
          <div
            ref={spotRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.3s",
              zIndex: 0,
            }}
          />

          {/* Gradient header band */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "var(--space-6) var(--space-8)",
              background: `linear-gradient(135deg, ${accentDim.replace("0.08", "0.15")} 0%, ${accentDim.replace("0.08", "0.05")} 100%)`,
              borderBottom: `1px solid ${accentBorder}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "var(--space-4)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: accent,
                  letterSpacing: "var(--tracking-widest)",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {layer}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: badgeColor,
                  background: `${badgeColor}15`,
                  border: `1px solid ${badgeColor}40`,
                  borderRadius: "var(--radius-full)",
                  padding: "0.2rem 0.6rem",
                  whiteSpace: "nowrap",
                }}
              >
                {badge}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "var(--text-xl)",
                color: "var(--color-text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              {name}
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-snug)",
                fontStyle: "italic",
              }}
            >
              {tagline}
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              padding: "var(--space-8)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-6)",
            }}
          >
            <p
              style={{
                fontSize: "var(--text-sm)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-text-tertiary)",
              }}
            >
              {description}
            </p>

            <ul
              style={{
                marginTop: "auto",
                paddingTop: "var(--space-5)",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                listStyle: "none",
              }}
            >
              {features.map((feat) => (
                <li
                  key={feat}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-3)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${accent}20`,
                      border: `1px solid ${accentBorder}`,
                      borderRadius: "var(--radius-sm)",
                      marginTop: "1px",
                    }}
                  >
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 3l2 2 4-4"
                        stroke={accent}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Flip hint — proper affordance */}
          <div
            style={{
              position: "absolute",
              bottom: "var(--space-2)",
              right: "var(--space-2)",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: accent,
                letterSpacing: "var(--tracking-wide)",
                background: `${accent}12`,
                border: `1px solid ${accent}35`,
                borderRadius: "var(--radius-full)",
                padding: "0.3rem 0.75rem",
                userSelect: "none",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 6a4 4 0 1 0 4-4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M6 2L4 4l2 2"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isFlipped ? "Flip back" : "view"}
            </span>
          </div>
        </div>

        {/* Back face */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, ${accentDim.replace("0.08", "0.12")} 0%, var(--color-bg-surface) 100%)`,
            border: `1px solid ${accentBorder}`,
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: "var(--space-8)",
          }}
        >
          {/* Back face header */}
          <div style={{ marginBottom: "var(--space-5)" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: accent,
                letterSpacing: "var(--tracking-widest)",
                textTransform: "uppercase",
              }}
            >
              {layer} · Technical View
            </span>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "var(--text-lg)",
                color: "var(--color-text-primary)",
                marginTop: "0.5rem",
              }}
            >
              {name}
            </h4>
          </div>

          {/* Mini diagram */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BackDiagram product={product} />
          </div>

          {/* Click hint */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-text-muted)",
              textAlign: "center",
              marginTop: "var(--space-4)",
            }}
          >
            Click to flip back
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('[data-product-card]')
      if (!cards) return
      gsap.from(cards, {
        y: 48, opacity: 0, scale: 0.96,
        duration: 0.85, ease: EASE.entrance,
        stagger: { each: 0.14 },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="products"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--color-bg-base)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-content)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 'var(--section-gap)' }}>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)',
            }}>Products</p>
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
            Three products. One platform.
          </WordReveal>

          {/* Availability status bar */}
          <FadeUp delay={0.1}>
            <div style={{
              display: 'flex', alignItems: 'center', flexWrap: 'wrap',
              gap: 'var(--space-4)', marginBottom: 'var(--space-6)',
            }}>
              {LAYER_STATUS.map(({ label, color }) => (
                <span key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color, letterSpacing: 'var(--tracking-wide)',
                }}>
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: `0 0 6px ${color}`,
                  }} />
                  {label}
                </span>
              ))}
            </div>
          </FadeUp>

          {/* Principles chips */}
          <FadeUp delay={0.15}>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border)',
            }}>
              {PRINCIPLES.map(({ label, color, dim, border, tip }) => (
                <span
                  key={label}
                  title={tip}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    letterSpacing: 'var(--tracking-wide)',
                    color, background: dim, border: `1px solid ${border}`,
                    borderRadius: 'var(--radius-full)', padding: '0.3rem 0.75rem',
                    cursor: 'default', whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Product cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}
