'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-void)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-16) var(--section-padding-x)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        {/* Icon */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239,68,68,0.25)',
            backgroundColor: 'rgba(239,68,68,0.08)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path
              d="M11 3.5L18.794 17H3.206L11 3.5Z"
              stroke="rgb(239,68,68)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M11 9V13"
              stroke="rgb(239,68,68)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="11" cy="15.5" r="0.8" fill="rgb(239,68,68)" />
          </svg>
        </div>

        {/* Mono label */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
            color: 'rgba(239,68,68,0.7)',
            marginBottom: 'var(--space-3)',
          }}
        >
          Runtime error
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-3)',
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-tertiary)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-8)',
          }}
        >
          An unexpected error occurred. If the problem persists, check the console for details.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.6rem 1.4rem',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              background: 'var(--gradient-accent)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'none',
              boxShadow: 'var(--glow-accent-sm)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-md)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-sm)' }}
          >
            Try again
          </button>

          <a
            href="/"
            style={{
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
            Go home
          </a>
        </div>
      </div>
    </main>
  )
}
