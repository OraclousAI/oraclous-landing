'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { FadeUp } from '@/components/animation/FadeUp'
import { WordReveal } from '@/components/animation/WordReveal'
import { useMagnetic } from '@/hooks/useMagnetic'
import { openCalendly } from '@/lib/calendly'

function burstParticles(x: number, y: number) {
  if (prefersReducedMotion()) return
  const colors = ['#4361EE', '#8B5CF6', '#22C55E', '#F97316', '#EAB308', '#06B6D4']
  Array.from({ length: 26 }).forEach(() => {
    const el = document.createElement('div')
    el.style.cssText = `position:fixed;pointer-events:none;width:5px;height:5px;border-radius:50%;z-index:9999;left:${x}px;top:${y}px;transform:translate(-50%,-50%);background:${colors[Math.floor(Math.random() * colors.length)]};box-shadow:0 0 6px currentColor;`
    document.body.appendChild(el)
    const angle = Math.random() * Math.PI * 2
    const dist  = 50 + Math.random() * 130
    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      scale: 0.1 + Math.random() * 0.7,
      duration: 0.55 + Math.random() * 0.45,
      ease: 'power2.out',
      onComplete: () => el.remove(),
    })
  })
}

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const glow1Ref   = useRef<HTMLDivElement>(null)
  const glow2Ref   = useRef<HTMLDivElement>(null)
  const dotGridRef = useRef<HTMLDivElement>(null)
  const callRef    = useMagnetic<HTMLAnchorElement>(0.4)
  const githubRef  = useMagnetic<HTMLAnchorElement>(0.2)

  /* Ambient pulsing glows */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(glow1Ref.current, { scale: 1.18, opacity: 0.6, duration: 4,   ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to(glow2Ref.current, { scale: 0.85, opacity: 0.35, duration: 5.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* Dot-grid cursor parallax */
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const grid = dotGridRef.current
    if (!grid || prefersReducedMotion()) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = (e.clientX - rect.left - rect.width / 2) / rect.width
    const cy = (e.clientY - rect.top  - rect.height / 2) / rect.height
    gsap.to(grid, { x: cx * -18, y: cy * -12, duration: 1.2, ease: 'power2.out', overwrite: 'auto' })
  }

  return (
    <section
      id="cta"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      style={{
        position: 'relative', overflow: 'hidden',
        backgroundColor: 'var(--color-bg-void)',
        padding: 'var(--section-padding-y) var(--section-padding-x)',
      }}
    >
      {/* Glows */}
      <div ref={glow1Ref} aria-hidden="true" style={{
        position: 'absolute', inset: '5%', borderRadius: '50%',
        background: 'radial-gradient(ellipse 65% 55% at 40% 55%, rgba(67,97,238,0.22) 0%, transparent 70%)',
        filter: 'blur(35px)', pointerEvents: 'none', opacity: 0.45,
      }} />
      <div ref={glow2Ref} aria-hidden="true" style={{
        position: 'absolute', inset: '20%', borderRadius: '50%',
        background: 'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none', opacity: 0.5,
      }} />
      <div ref={dotGridRef} aria-hidden="true" style={{
        position: 'absolute', inset: '-10%',
        backgroundImage: 'radial-gradient(circle, rgba(67,97,238,0.15) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
        maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 10%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 10%, transparent 70%)',
        opacity: 0.4,
      }} />

      {/* Two-column layout */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-16)', alignItems: 'center',
      }}>

        {/* LEFT: headline */}
        <div>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-6)',
            }}>
              Ready to start
            </p>
          </FadeUp>

          <WordReveal as="h2" style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2.4rem, 4vw, 3.75rem)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tighter)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
          }}>
            Your infrastructure.
          </WordReveal>
          <WordReveal as="h2" delay={0.15} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2.4rem, 4vw, 3.75rem)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tighter)',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 'var(--space-8)',
          }}>
            Your model.
          </WordReveal>

          {/* Three proof points */}
          <FadeUp delay={0.3}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { dot: '#4361EE', text: 'Zero data egress — everything runs on your infra' },
                { dot: '#8B5CF6', text: 'MIT licensed — no vendor lock-in, ever' },
                { dot: '#22C55E', text: '18 agents, fully autonomous fine-tuning loop' },
              ].map(({ dot, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{
                    flexShrink: 0, width: '6px', height: '6px', borderRadius: '50%',
                    background: dot, boxShadow: `0 0 6px ${dot}`,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)',
                  }}>{text}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* RIGHT: CTA card */}
        <FadeUp delay={0.2}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(67,97,238,0.08) 0%, rgba(13,13,26,0.95) 100%)',
            border: '1px solid rgba(67,97,238,0.22)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-10)',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-3)',
              }}>Book a free strategy call</p>
              <p style={{
                fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)',
                lineHeight: 'var(--leading-relaxed)',
              }}>
                30 minutes with our team. We'll map out exactly how Oraclous fits your
                stack and what fine-tuning gains you can expect in the first 90 days.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <a
                ref={callRef}
                href="#"
                onClick={(e) => { e.preventDefault(); burstParticles(e.clientX, e.clientY); openCalendly() }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.85rem 1.5rem', background: 'var(--gradient-accent)',
                  borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase', color: '#fff', textDecoration: 'none',
                  boxShadow: 'var(--glow-accent-md)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a Free AI Strategy Call
              </a>
              <a
                ref={githubRef}
                href="https://github.com/oraclous-ai"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.85rem 1.5rem',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase', color: 'var(--color-text-secondary)',
                  textDecoration: 'none', transition: 'border-color 0.25s, color 0.25s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Star on GitHub
              </a>
            </div>

            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
              textAlign: 'center',
            }}>
              MIT License · Open Source · Self-Hosted · No credit card
            </p>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
