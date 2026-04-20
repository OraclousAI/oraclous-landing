'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function NotFound() {
  const codeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        codeRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.05 },
      )
      gsap.fromTo(
        '[data-animate]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, delay: 0.35 },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-void)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-16) var(--section-padding-x)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(67,97,238,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(67,97,238,0.04) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Glow orb */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,97,238,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '520px' }}>
        {/* Large 404 */}
        <div
          ref={codeRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(100px, 22vw, 190px)',
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(67,97,238,0.25)',
            letterSpacing: '-0.04em',
            marginBottom: 'var(--space-8)',
            opacity: 0,
            userSelect: 'none',
          }}
        >
          404
        </div>

        {/* Mono label */}
        <p
          data-animate=""
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-4)',
            opacity: 0,
          }}
        >
          Node not found
        </p>

        <h1
          data-animate=""
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 'var(--leading-snug)',
            marginBottom: 'var(--space-4)',
            opacity: 0,
          }}
        >
          This node doesn&apos;t exist
        </h1>

        <p
          data-animate=""
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-tertiary)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-10)',
            opacity: 0,
          }}
        >
          The page you&apos;re looking for isn&apos;t in the knowledge graph.
          It may have been moved or removed.
        </p>

        {/* CTA */}
        <div
          data-animate=""
          suppressHydrationWarning
          style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}
        >
          <Link
            href="/"
            suppressHydrationWarning
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.4rem',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              background: 'var(--gradient-accent)',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--glow-accent-sm)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-md)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-sm)' }}
          >
            ← Back to home
          </Link>

          <Link
            href="/architecture"
            suppressHydrationWarning
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.6rem 1.4rem',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              textDecoration: 'none',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-accent)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-text-tertiary)'
            }}
          >
            View architecture
          </Link>
        </div>
      </div>
    </main>
  )
}
