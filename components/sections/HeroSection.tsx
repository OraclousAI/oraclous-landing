'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE, DUR } from '@/lib/gsap'
import { useUIStore } from '@/stores/ui.store'
import { prefersReducedMotion } from '@/lib/motion'
import { useMagnetic } from '@/hooks/useMagnetic'

const STAT_ITEMS = [
  { value: '18', label: 'Specialist Agents' },
  { value: '10', label: 'Automation Stages' },
  { value: '58+', label: 'Test Suites' },
  { value: 'MIT', label: 'Open Source' },
]

const RING_COLORS = [
  '#4361EE','#8B5CF6','#06B6D4','#F97316','#22C55E',
  '#3B82F6','#A855F7','#EAB308','#10B981','#EF4444',
]
const RING_LABELS = ['Connect','Structure','Analyze','Research','Curate','Select','Train','Evaluate','Deploy','Monitor']
const CX = 200, CY = 200, R = 150
const RING_NODES = RING_LABELS.map((_, i) => {
  const a = (-90 + i * 36) * (Math.PI / 180)
  return { x: Math.round(CX + R * Math.cos(a)), y: Math.round(CY + R * Math.sin(a)) }
})

export function HeroSection() {
  const heroRef    = useRef<HTMLElement>(null)
  const orb1Ref    = useRef<HTMLDivElement>(null)
  const orb2Ref    = useRef<HTMLDivElement>(null)
  const orb3Ref    = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ringRef    = useRef<SVGSVGElement>(null)
  const isLoaderComplete = useUIStore((s) => s.isLoaderComplete)
  const primaryRef = useMagnetic<HTMLAnchorElement>(0.4)
  const ghostRef   = useMagnetic<HTMLAnchorElement>(0.25)

  /* Multi-layer mouse parallax: orbs + grid + content 3D tilt + ring counter-rotation */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = heroRef.current
    const content = contentRef.current
    if (!section) return

    const q1x = gsap.quickTo(orb1Ref.current, 'x', { duration: 1.2, ease: 'power2.out' })
    const q1y = gsap.quickTo(orb1Ref.current, 'y', { duration: 1.2, ease: 'power2.out' })
    const q2x = gsap.quickTo(orb2Ref.current, 'x', { duration: 1.8, ease: 'power2.out' })
    const q2y = gsap.quickTo(orb2Ref.current, 'y', { duration: 1.8, ease: 'power2.out' })
    const q3x = gsap.quickTo(orb3Ref.current, 'x', { duration: 2.4, ease: 'power2.out' })
    const q3y = gsap.quickTo(orb3Ref.current, 'y', { duration: 2.4, ease: 'power2.out' })
    const qGx  = gsap.quickTo(gridRef.current,  'x', { duration: 3.5, ease: 'power2.out' })
    const qGy  = gsap.quickTo(gridRef.current,  'y', { duration: 3.5, ease: 'power2.out' })

    /* Content 3D tilt — subtle, so text feels grounded in 3D space */
    if (content) gsap.set(content, { transformPerspective: 1400 })

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2
      const cy = (e.clientY / window.innerHeight - 0.5) * 2
      q1x(cx * 55);  q1y(cy * 45)
      q2x(cx * -45); q2y(cy * -35)
      q3x(cx * 28);  q3y(cy * 22)
      qGx(cx * -14); qGy(cy * -10)
      if (content) gsap.to(content, { rotateY: cx * 3.5, rotateX: cy * -3.5, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(ringRef.current, { rotation: cx * -8, duration: 1.8, ease: 'power2.out', overwrite: 'auto' })
    }
    section.addEventListener('mousemove', onMove)
    return () => {
      section.removeEventListener('mousemove', onMove)
      if (content) gsap.killTweensOf(content)
      gsap.killTweensOf(ringRef.current)
    }
  }, [])

  /* Ambient orb drift */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, { scale: 1.12, duration: 6,   ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to(orb2Ref.current, { scale: 0.88, duration: 7.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.5 })
      gsap.to(orb3Ref.current, { scale: 1.08, duration: 5,   ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 3 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  /* Ring ambient node pulse */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const nodes = ringRef.current?.querySelectorAll('[data-ring-node]')
      if (!nodes) return
      nodes.forEach((node, i) => {
        gsap.to(node, {
          opacity: 0.55 + 0.45 * Math.sin(i * 0.628),
          filter: `drop-shadow(0 0 ${4 + i * 1.5}px ${RING_COLORS[i]})`,
          duration: 2.2 + i * 0.18,
          ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.22,
        })
      })
    }, ringRef)
    return () => ctx.revert()
  }, [isLoaderComplete])

  /* Content entrance */
  useEffect(() => {
    const el = contentRef.current
    if (!isLoaderComplete || !el) return
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 })
      gsap.set(ringRef.current, { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo('[data-hero-eyebrow]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: EASE.entrance })
        .fromTo('[data-hero-line1]',   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.emphasis, ease: EASE.entrance }, '-=0.2')
        .fromTo('[data-hero-line2]',   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.emphasis, ease: EASE.entrance }, '-=0.55')
        .fromTo('[data-hero-sub]',     { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: EASE.entrance }, '-=0.4')
        .fromTo('[data-hero-ctas]',    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: EASE.entrance }, '-=0.3')
        .fromTo('[data-hero-stat]',    { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: EASE.entrance, stagger: 0.08 }, '-=0.2')
        .fromTo(ringRef.current,       { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.2, ease: EASE.entrance }, '-=0.5')
      gsap.set(el, { opacity: 1 })
    }, contentRef)
    return () => ctx.revert()
  }, [isLoaderComplete])

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-void)',
        paddingTop: '5rem',
      }}
    >
      {/* Dot grid — separate ref for slow parallax */}
      <div ref={gridRef} aria-hidden="true" style={{
        position: 'absolute', inset: '-8%',
        backgroundImage: 'radial-gradient(circle, rgba(67,97,238,0.22) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 15%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 15%, transparent 70%)',
        opacity: 0.5,
        willChange: 'transform',
      }} />

      {/* Gradient mesh center */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: '5% 15%',
        background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(67,97,238,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Orb 1 — left, now visible with reduced blur */}
      <div ref={orb1Ref} aria-hidden="true" style={{
        position: 'absolute',
        width: 'clamp(400px, 45vw, 700px)', height: 'clamp(400px, 45vw, 700px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(67,97,238,0.32) 0%, transparent 68%)',
        top: '5%', left: '0%',
        filter: 'blur(40px)', pointerEvents: 'none',
        willChange: 'transform',
      }} />

      {/* Orb 2 — right, now visible with reduced blur */}
      <div ref={orb2Ref} aria-hidden="true" style={{
        position: 'absolute',
        width: 'clamp(350px, 40vw, 600px)', height: 'clamp(350px, 40vw, 600px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 68%)',
        top: '15%', right: '0%',
        filter: 'blur(40px)', pointerEvents: 'none',
        willChange: 'transform',
      }} />

      {/* Orb 3 — center bottom */}
      <div ref={orb3Ref} aria-hidden="true" style={{
        position: 'absolute',
        width: 'clamp(200px, 30vw, 450px)', height: 'clamp(200px, 30vw, 450px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(67,97,238,0.14) 0%, transparent 70%)',
        bottom: '10%', left: '50%', transform: 'translateX(-50%)',
        filter: 'blur(55px)', pointerEvents: 'none',
        willChange: 'transform',
      }} />

      {/* Bottom fade */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to top, var(--color-bg-void), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Two-column grid: content left, ring right */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 'var(--max-w-content)',
        width: '100%',
        padding: '0 var(--section-padding-x)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-16)',
        alignItems: 'center',
        alignSelf: 'center',
      }}>

        {/* LEFT: content */}
        <div
          ref={contentRef}
          style={{
            position: 'relative',
            opacity: 0,
            willChange: 'transform',
          }}
        >
          {/* Eyebrow */}
          <div data-hero-eyebrow="" style={{ marginBottom: '2rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-accent)',
              border: '1px solid var(--color-border-accent)',
              borderRadius: 'var(--radius-full)', padding: '0.35rem 1rem',
              backgroundColor: 'var(--color-accent-dim)',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                animation: 'pulse-ring 2s ease-in-out infinite',
              }} />
              Open-Source FTOps Platform
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.85rem, 2.8vw, 2.9rem)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tighter)',
            marginBottom: '1.75rem',
          }}>
            <span data-hero-line1="" style={{ display: 'block', color: 'var(--color-text-primary)' }}>
              The fine-tuning team
            </span>
            <span data-hero-line2="" style={{
              display: 'block',
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              that runs itself.
            </span>
          </h1>

          {/* Sub */}
          <p data-hero-sub="" style={{
            fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-secondary)',
            maxWidth: '440px', marginBottom: '2.5rem',
          }}>
            18 specialist agents. One knowledge graph. Complete automation of the
            fine-tuning lifecycle — on your infrastructure, with full data ownership.
          </p>

          {/* CTAs */}
          <div data-hero-ctas="" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <a
              ref={primaryRef}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                ;(window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/reza-oraclous/consultancy-with-reza-oraclous' })
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2rem', background: 'var(--gradient-accent)',
                borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase', color: '#fff', textDecoration: 'none',
                boxShadow: 'var(--glow-accent-md)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book a Free AI Strategy Call.
            </a>
            <a
              ref={ghostRef}
              href="#loop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2rem',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase', color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                transition: 'border-color 0.25s, color 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }}
            >
              Explore the loop →
            </a>
          </div>

          {/* Stat row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            gap: '0', flexWrap: 'wrap',
          }}>
            {STAT_ITEMS.map((s, i) => (
              <div key={s.label} data-hero-stat="" style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 1.5rem' }} />
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                    fontSize: 'var(--text-lg)', color: 'var(--color-text-accent)',
                    lineHeight: 1, marginBottom: '0.25rem',
                  }}>{s.value}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                  }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: loop ring visualization */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <svg ref={ringRef} viewBox="-20 -20 440 440" width="100%" style={{ display: 'block', overflow: 'visible', opacity: 0, maxWidth: '520px' }} data-hero-ring="">
            {/* Outer subtle ring */}
            <circle cx={CX} cy={CY} r={R + 22} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            {/* Main track */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            {/* Inner track */}
            <circle cx={CX} cy={CY} r={R - 22} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Colored arcs between nodes */}
            {RING_COLORS.map((color, i) => {
              const a1 = (-90 + i * 36) * (Math.PI / 180)
              const a2 = (-90 + ((i + 1) % 10) * 36) * (Math.PI / 180)
              const x1 = Math.round(CX + R * Math.cos(a1)), y1 = Math.round(CY + R * Math.sin(a1))
              const x2 = Math.round(CX + R * Math.cos(a2)), y2 = Math.round(CY + R * Math.sin(a2))
              return (
                <path key={i}
                  d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                  fill="none" stroke={color} strokeWidth="2.5" opacity={0.55}
                />
              )
            })}

            {/* Stage nodes */}
            {RING_NODES.map((pos, i) => (
              <g key={i} transform={`translate(${pos.x}, ${pos.y})`} data-ring-node="">
                <circle r="14" fill="#0D0D1A" stroke={RING_COLORS[i]} strokeWidth="2" opacity={0.9}
                  style={{ filter: `drop-shadow(0 0 8px ${RING_COLORS[i]}90)` } as React.CSSProperties} />
                <text textAnchor="middle" dominantBaseline="central"
                  fontFamily="monospace" fontSize="7" fontWeight="700"
                  fill={RING_COLORS[i]} style={{ pointerEvents: 'none' } as React.CSSProperties}>
                  {String(i + 1).padStart(2, '0')}
                </text>
              </g>
            ))}

            {/* Center label */}
            <text x={CX} y={CY - 10} textAnchor="middle" fontFamily="monospace" fontSize="10"
              letterSpacing="3" fill="rgba(255,255,255,0.22)" fontWeight="700">FTOPS</text>
            <text x={CX} y={CY + 8} textAnchor="middle" fontFamily="monospace" fontSize="10"
              letterSpacing="3" fill="rgba(255,255,255,0.22)" fontWeight="700">LOOP</text>
            <text x={CX} y={CY + 24} textAnchor="middle" fontFamily="monospace" fontSize="8"
              letterSpacing="1" fill="rgba(255,255,255,0.12)">10 STAGES</text>
          </svg>
        </div>

      </div>

      {/* Scroll cue */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}>Scroll</span>
        <div style={{
          width: '1px', height: '48px',
          background: 'linear-gradient(to bottom, var(--color-accent), transparent)',
          animation: 'scroll-cue 1.8s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
