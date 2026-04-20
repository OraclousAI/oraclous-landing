'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'

const NODES = [
  { id: 'h0', x: 160, y: 120, r: 12, cluster: 0, label: 'Entity A' },
  { id: 'h1', x: 280, y: 200, r: 12, cluster: 1, label: 'Context'  },
  { id: 'h2', x: 140, y: 290, r: 12, cluster: 2, label: 'Coverage' },
  { id: 'c0a', x:  80, y:  80, r: 7,  cluster: 0, label: '' },
  { id: 'c0b', x: 200, y:  70, r: 7,  cluster: 0, label: '' },
  { id: 'c0c', x: 230, y: 130, r: 6,  cluster: 0, label: '' },
  { id: 'c0d', x:  60, y: 160, r: 6,  cluster: 0, label: '' },
  { id: 'c1a', x: 350, y: 140, r: 7,  cluster: 1, label: '' },
  { id: 'c1b', x: 380, y: 230, r: 7,  cluster: 1, label: '' },
  { id: 'c1c', x: 310, y: 280, r: 6,  cluster: 1, label: '' },
  { id: 'c1d', x: 360, y: 300, r: 6,  cluster: 1, label: '' },
  { id: 'c2a', x:  70, y: 320, r: 7,  cluster: 2, label: '' },
  { id: 'c2b', x: 200, y: 350, r: 7,  cluster: 2, label: '' },
  { id: 'c2c', x: 110, y: 380, r: 6,  cluster: 2, label: '' },
  { id: 'c2d', x: 260, y: 290, r: 6,  cluster: 2, label: '' },
]

const EDGES = [
  ['h0', 'h1'], ['h1', 'h2'], ['h0', 'h2'],
  ['h0', 'c0a'], ['h0', 'c0b'], ['h0', 'c0c'], ['h0', 'c0d'], ['c0a', 'c0b'],
  ['h1', 'c1a'], ['h1', 'c1b'], ['h1', 'c1c'], ['c1a', 'c1b'], ['c1b', 'c1d'], ['c1c', 'c1d'],
  ['h2', 'c2a'], ['h2', 'c2b'], ['h2', 'c2c'], ['h2', 'c2d'], ['c2a', 'c2c'], ['c2b', 'c2d'],
  ['c0c', 'c1a'], ['c1c', 'c2d'], ['c0d', 'c2a'],
]

const CLUSTER_COLORS = ['#4361EE', '#8B5CF6', '#06B6D4']
const CLUSTER_NAMES  = ['Entity Cluster', 'Context Cluster', 'Coverage Cluster']
const nodeMap = new Map(NODES.map(n => [n.id, n]))

const POINTS = [
  {
    cluster: 0,
    title: 'Context that compounds',
    body: 'A flat vector store forgets structure. A knowledge graph remembers that entity A caused event B, which contradicts claim C from 6 months ago. That relational memory is what makes fine-tuned models actually reason.',
  },
  {
    cluster: 1,
    title: 'Analysis only possible at graph level',
    body: "You can't run Leiden community detection on a text file. You can't detect bitemporal drift in a vector index. Graph structure unlocks eight classes of analysis that vector search fundamentally cannot do.",
  },
  {
    cluster: 2,
    title: "Training data that knows its own gaps",
    body: "Coverage analysis surfaces what should be in your knowledge base but isn't. Link prediction surfaces facts that are probably true. These gaps are training gold — invisible without graph structure.",
  },
]

/* Same-cluster edges only (for particles) */
const INTRA_EDGES = EDGES.filter(([a, b]) => {
  const na = nodeMap.get(a), nb = nodeMap.get(b)
  return na && nb && na.cluster === nb.cluster
})

export function WhyKGSection() {
  const sectionRef     = useRef<HTMLElement>(null)
  const svgRef         = useRef<SVGSVGElement>(null)
  const [activeCluster, setActiveCluster] = useState<number | null>(null)
  const [clickedNodeId, setClickedNodeId] = useState<string | null>(null)

  /* Draw-in animation on scroll */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const nodeEls = svgRef.current?.querySelectorAll('[data-node]')
      const edgeEls = svgRef.current?.querySelectorAll('[data-edge]')
      if (!nodeEls || !edgeEls) return

      edgeEls.forEach((el) => {
        const len = (el as SVGLineElement).getTotalLength?.() ?? 60
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.to(edgeEls, {
        strokeDashoffset: 0,
        duration: 0.6, ease: 'power1.inOut',
        stagger: { each: 0.04, from: 'random' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
      gsap.from(nodeEls, {
        scale: 0, opacity: 0,
        duration: 0.4, ease: EASE.emphasis,
        stagger: { each: 0.05, from: 'random' },
        transformOrigin: 'center center',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* Ambient node breathing — starts after draw-in settles */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      NODES.forEach((node, i) => {
        const el = svgRef.current?.querySelector(`[data-node="${node.id}"] circle:last-child`)
        if (!el) return
        gsap.to(el, {
          scale: 1 + (node.r > 8 ? 0.08 : 0.14),
          duration: 1.8 + (i % 5) * 0.4,
          ease: 'sine.inOut', repeat: -1, yoyo: true,
          delay: 1.5 + (i % 7) * 0.3,
          transformOrigin: 'center center',
        })
      })
    }, svgRef)
    return () => ctx.revert()
  }, [])

  /* Edge particles for active cluster — smooth fade-out before switching */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const allParticles = svg.querySelectorAll('[data-particle]')

    /* Fade existing particles out smoothly before switching */
    gsap.to(allParticles, { opacity: 0, duration: 0.18, overwrite: true })

    if (activeCluster === null || prefersReducedMotion()) return

    /* Start new cluster particles after fade completes (0.2s base delay) */
    svg.querySelectorAll(`[data-particle-cluster="${activeCluster}"]`).forEach((particle) => {
      const edgeId = particle.getAttribute('data-particle')
      if (!edgeId) return
      const [a, b] = edgeId.split('-')
      const na = nodeMap.get(a), nb = nodeMap.get(b)
      if (!na || !nb) return
      gsap.fromTo(particle,
        { attr: { cx: na.x + 20, cy: na.y + 20 }, opacity: 0.9 },
        {
          attr: { cx: nb.x + 20, cy: nb.y + 20 },
          opacity: 0,
          duration: 0.85 + Math.random() * 0.55,
          ease: 'none',
          repeat: -1,
          delay: 0.2 + Math.random() * 1.4,
        }
      )
    })
  }, [activeCluster])

  const getNodeColor = (node: typeof NODES[number]) => {
    const base = CLUSTER_COLORS[node.cluster]
    if (activeCluster === null) return base
    return node.cluster === activeCluster ? base : 'rgba(255,255,255,0.08)'
  }

  const getEdgeOpacity = (edgeId: string) => {
    if (activeCluster === null) return 0.22
    const [a, b] = edgeId.split('-')
    const na = nodeMap.get(a), nb = nodeMap.get(b)
    if (!na || !nb) return 0.08
    return na.cluster === activeCluster && nb.cluster === activeCluster ? 0.7 : 0.04
  }

  const clickedNode = clickedNodeId ? nodeMap.get(clickedNodeId) : null
  const connectedCount = clickedNode
    ? EDGES.filter(([a, b]) => a === clickedNodeId || b === clickedNodeId).length
    : 0

  return (
    <section
      id="why-kg"
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
            }}>Why a knowledge graph</p>
          </FadeUp>
          <WordReveal as="h2" style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)',
          }}>
            Structure unlocks what vectors can't see.
          </WordReveal>
        </div>

        {/* Main: points + animated graph */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 420px',
          gap: 'var(--space-16)', alignItems: 'center',
        }}>

          {/* Left: interactive points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <FadeUp delay={0.05}>
              <blockquote style={{
                padding: 'var(--space-6) var(--space-8)',
                background: 'linear-gradient(135deg, rgba(67,97,238,0.1) 0%, rgba(139,92,246,0.06) 100%)',
                border: '1px solid var(--color-border-accent)',
                borderLeft: '3px solid var(--color-accent)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 'var(--space-6)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'var(--text-base)', color: 'var(--color-text-primary)',
                  lineHeight: 'var(--leading-snug)', fontStyle: 'italic',
                }}>
                  "A vector database tells you what's similar. A knowledge graph tells you
                  what's related, what's missing, what contradicts, and what's changed."
                </p>
              </blockquote>
            </FadeUp>

            {POINTS.map(({ cluster, title, body }, i) => {
              const color    = CLUSTER_COLORS[cluster]
              const isActive = activeCluster === cluster
              return (
                <FadeUp key={title} delay={i * 0.1}>
                  <div
                    onMouseEnter={() => setActiveCluster(cluster)}
                    onMouseLeave={() => setActiveCluster(null)}
                    style={{
                      padding: 'var(--space-6) var(--space-7)',
                      background: isActive
                        ? `linear-gradient(135deg, ${color}12 0%, rgba(13,13,26,0.95) 100%)`
                        : 'var(--color-bg-surface)',
                      border: `1px solid ${isActive ? `${color}40` : 'var(--color-border)'}`,
                      borderLeft: `3px solid ${isActive ? color : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'default',
                      transition: 'background 0.3s, border-color 0.3s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                        transition: 'box-shadow 0.3s', flexShrink: 0,
                      }} />
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)',
                        lineHeight: 'var(--leading-snug)',
                      }}>{title}</h3>
                    </div>
                    <p style={{
                      fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--color-text-tertiary)', paddingLeft: 'var(--space-5)',
                    }}>{body}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>

          {/* Right: SVG knowledge graph */}
          <div style={{ position: 'relative' }}>
            <svg
              ref={svgRef}
              viewBox="0 0 440 440"
              width="100%"
              style={{ display: 'block', overflow: 'visible' }}
              onClick={() => setClickedNodeId(null)}
            >
              <defs>
                <radialGradient id="kg-bg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="rgba(67,97,238,0.08)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="node-glow">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ellipse cx="220" cy="220" rx="200" ry="200" fill="url(#kg-bg)" />

              {/* Edges */}
              {EDGES.map(([a, b]) => {
                const na = nodeMap.get(a), nb = nodeMap.get(b)
                if (!na || !nb) return null
                const edgeId       = `${a}-${b}`
                const sameCluster  = na.cluster === nb.cluster
                const c = sameCluster ? CLUSTER_COLORS[na.cluster] : 'rgba(255,255,255,0.3)'
                return (
                  <line
                    key={edgeId}
                    data-edge={edgeId}
                    x1={na.x + 20} y1={na.y + 20}
                    x2={nb.x + 20} y2={nb.y + 20}
                    stroke={c}
                    strokeWidth={sameCluster ? 1.5 : 0.8}
                    opacity={getEdgeOpacity(edgeId)}
                    style={{ transition: 'opacity 0.35s' }}
                  />
                )
              })}

              {/* Intra-cluster edge particles */}
              {INTRA_EDGES.map(([a, b]) => {
                const na = nodeMap.get(a), nb = nodeMap.get(b)
                if (!na || !nb) return null
                const color = CLUSTER_COLORS[na.cluster]
                return (
                  <circle
                    key={`p-${a}-${b}`}
                    data-particle={`${a}-${b}`}
                    data-particle-cluster={na.cluster}
                    r="2.5"
                    fill={color}
                    cx={na.x + 20}
                    cy={na.y + 20}
                    opacity="0"
                    style={{ filter: `drop-shadow(0 0 4px ${color})`, pointerEvents: 'none' }}
                  />
                )
              })}

              {/* Nodes */}
              {NODES.map((node) => {
                const isActive    = activeCluster === node.cluster
                const isClicked   = clickedNodeId === node.id
                const color       = getNodeColor(node)
                const isHub       = ['h0', 'h1', 'h2'].includes(node.id)
                return (
                  <g
                    key={node.id}
                    data-node={node.id}
                    transform={`translate(${node.x + 20}, ${node.y + 20})`}
                    onMouseEnter={() => setActiveCluster(node.cluster)}
                    onMouseLeave={() => setActiveCluster(null)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setClickedNodeId(isClicked ? null : node.id)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {isClicked && (
                      <circle r={node.r + 10} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
                    )}
                    {isActive && isHub && (
                      <circle r={node.r + 8} fill={`${color}20`} stroke={color} strokeWidth="1" strokeOpacity="0.4" />
                    )}
                    <circle
                      r={node.r}
                      fill={isActive ? color : `${color}60`}
                      stroke={color}
                      strokeWidth={isHub ? 1.5 : 0.8}
                      style={{ transition: 'fill 0.35s' }}
                      filter={isActive && isHub ? 'url(#node-glow)' : undefined}
                    />
                    {isHub && node.label && (
                      <text
                        dy="-14" textAnchor="middle"
                        fontFamily="monospace" fontSize="9"
                        fill={isActive ? color : 'rgba(255,255,255,0.3)'}
                        fontWeight="700"
                        style={{ transition: 'fill 0.35s', pointerEvents: 'none' }}
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Node click tooltip */}
            {clickedNode && (
              <div style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(13,13,26,0.96)',
                border: `1px solid ${CLUSTER_COLORS[clickedNode.cluster]}40`,
                borderLeft: `2px solid ${CLUSTER_COLORS[clickedNode.cluster]}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                minWidth: '180px',
                pointerEvents: 'none',
                zIndex: 10,
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  color: CLUSTER_COLORS[clickedNode.cluster],
                  marginBottom: '4px',
                }}>
                  {CLUSTER_NAMES[clickedNode.cluster]}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
                  marginBottom: '4px',
                }}>
                  {clickedNode.label || `Node ${clickedNode.id}`}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: 'var(--color-text-muted)',
                }}>
                  {connectedCount} edge{connectedCount !== 1 ? 's' : ''} · r={clickedNode.r}
                </p>
              </div>
            )}

            <p style={{
              textAlign: 'center', marginTop: 'var(--space-4)',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
            }}>
              Hover to highlight cluster · Click a node to inspect
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
