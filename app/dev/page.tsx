import { redirect } from 'next/navigation'
import { AnimationDemos } from './AnimationDemos'

export default function DevPage() {
  if (process.env.NODE_ENV === 'production') redirect('/')

  return (
    <main
      style={{
        backgroundColor: 'var(--color-bg-void)',
        minHeight: '100vh',
        padding: '0 var(--section-padding-x)',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '5rem 0 3rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '0',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          Development only · Production redirects to /
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'var(--text-4xl)',
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--leading-tight)',
            marginBottom: '1rem',
          }}
        >
          Animation Playground
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', maxWidth: '560px' }}>
          Every animation primitive in isolation. Scroll to trigger. All respect{' '}
          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
            prefers-reduced-motion
          </code>
          . Build here first, compose in sections.
        </p>
      </header>

      {/* All primitive demos */}
      <AnimationDemos />

      {/* Footer spacer */}
      <div style={{ height: '8rem' }} />
    </main>
  )
}
