'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { FadeUp } from '@/components/animation/FadeUp'

const CATEGORIES = [
  {
    title: 'Getting Started',
    color: '#4361EE',
    bg: 'rgba(67,97,238,0.08)',
    border: 'rgba(67,97,238,0.28)',
    items: [
      { label: 'Prerequisites',           href: '#', desc: 'Node ≥ 20, Neo4j, Docker, a model endpoint' },
      { label: 'Installation',            href: '#', desc: 'Clone, configure env vars, run docker compose up' },
      { label: 'Connect your first source', href: '#', desc: 'Ingest a document folder into the knowledge graph' },
      { label: 'Run your first fine-tune', href: '#', desc: 'End-to-end walkthrough from ingestion to deployment' },
    ],
  },
  {
    title: 'Knowledge Graph',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.28)',
    items: [
      { label: 'Schema & entity types',   href: '#', desc: 'Built-in types, custom extensions, relationship patterns' },
      { label: 'Ingestion sources',        href: '#', desc: 'Documents, databases, APIs, code repos, webhooks' },
      { label: 'Bitemporal tracking',      href: '#', desc: 'event_time vs ingestion_time — how time works in the graph' },
      { label: 'Cross-graph federation',   href: '#', desc: 'SAME_AS resolution and multi-tenant data boundaries' },
      { label: 'ReBAC access control',     href: '#', desc: 'Service accounts, scopes, key rotation policies' },
    ],
  },
  {
    title: 'Agent Framework',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.28)',
    items: [
      { label: 'MCP tools reference',     href: '#', desc: 'All 15+ tools: signatures, return types, examples' },
      { label: 'Agent memory model',       href: '#', desc: 'Decay weighting, cross-agent queries, persistence' },
      { label: 'RAGAS evaluation',         href: '#', desc: 'Metrics, thresholds, regression gating setup' },
      { label: 'Visual Flow Studio',       href: '#', desc: 'Building and debugging workflows without code' },
      { label: 'Credential broker',        href: '#', desc: 'Scoped secrets, rotation, audit trail' },
    ],
  },
  {
    title: 'FTOps Pipeline',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.28)',
    items: [
      { label: 'Pipeline configuration',  href: '#', desc: 'Stage-by-stage YAML reference and defaults' },
      { label: 'HITL approval flows',      href: '#', desc: 'Configuring gates, notifications, override policies' },
      { label: 'Training method selection',href: '#', desc: 'When to use LoRA, QLoRA, DPO, ORPO, full fine-tune' },
      { label: 'Dataset curation',         href: '#', desc: 'SFT pairs, preference pairs, versioned snapshots' },
      { label: 'Drift detection',          href: '#', desc: 'Thresholds, re-trigger logic, monitoring dashboards' },
    ],
  },
  {
    title: 'Deployment',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.28)',
    items: [
      { label: 'Infrastructure requirements', href: '#', desc: 'Compute, storage, network — self-hosted checklist' },
      { label: 'Docker Compose setup',     href: '#', desc: 'Local dev and single-node production configs' },
      { label: 'Kubernetes deployment',    href: '#', desc: 'Helm chart reference and scaling guidelines' },
      { label: 'Canary rollout config',    href: '#', desc: 'Traffic split, rollback triggers, promotion gates' },
    ],
  },
  {
    title: 'API Reference',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.28)',
    items: [
      { label: 'REST API overview',        href: '#', desc: 'Auth, versioning, rate limits, error codes' },
      { label: 'Graph API',               href: '#', desc: 'Query and mutation endpoints for the knowledge graph' },
      { label: 'Agent API',               href: '#', desc: 'Trigger, observe, and control agent execution' },
      { label: 'Webhook events',          href: '#', desc: 'Event types, payload schemas, retry behavior' },
    ],
  },
] as const

export default function DocsPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  const filtered = query.trim().length > 1
    ? CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase())
        ),
      })).filter(cat => cat.items.length > 0)
    : CATEGORIES

  return (
    <div style={{ backgroundColor: 'var(--color-bg-void)', minHeight: '100vh' }}>

      {/* ── Page Hero ─────────────────────────────────────────────── */}
      <div style={{
        padding: '120px var(--section-padding-x) var(--space-12)',
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
      }}>
        <FadeUp>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <Link href="/" style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
              color: 'var(--color-text-muted)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              Oraclous
            </Link>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>Docs</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tighter)',
            color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)',
          }}>
            Documentation
          </h1>
          <p style={{
            maxWidth: '480px', fontSize: 'var(--text-base)',
            color: 'var(--color-text-tertiary)', lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-8)',
          }}>
            Everything you need to deploy, configure, and extend Oraclous on your own infrastructure.
          </p>
        </FadeUp>

        {/* Search */}
        <FadeUp delay={0.2}>
          <div style={{
            position: 'relative', maxWidth: '520px',
          }}>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
              style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)', pointerEvents: 'none',
              }}
            >
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search docs..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '42px', paddingRight: '16px',
                height: '46px',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(67,97,238,0.5)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,97,238,0.12)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        </FadeUp>
      </div>

      {/* ── Quick nav strip ────────────────────────────────────────── */}
      <FadeUp delay={0.3}>
        <div style={{
          maxWidth: 'var(--max-w-content)', margin: '0 auto',
          padding: '0 var(--section-padding-x) var(--space-12)',
          display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap',
        }}>
          {CATEGORIES.map(cat => (
            <a
              key={cat.title}
              href={`#${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                color: cat.color, background: cat.bg, border: `1px solid ${cat.border}`,
                borderRadius: 'var(--radius-full)', padding: '0.3rem 0.8rem',
                textDecoration: 'none', transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 14px ${cat.bg.replace('0.08', '0.25')}` }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
            >
              {cat.title}
            </a>
          ))}
        </div>
      </FadeUp>

      {/* ── Category grid ─────────────────────────────────────────── */}
      <div style={{
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
        padding: '0 var(--section-padding-x) var(--space-24)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-12)',
      }}>
        {filtered.length === 0 && (
          <div style={{
            padding: 'var(--space-16)', textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
          }}>
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {filtered.map(cat => (
          <section key={cat.title} id={cat.title.toLowerCase().replace(/\s+/g, '-')}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'var(--text-lg)', color: cat.color,
              }}>
                {cat.title}
              </h2>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${cat.border}, transparent)` }} />
            </div>

            {/* Item grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--space-3)',
            }}>
              {cat.items.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: 'var(--space-4) var(--space-5)',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = cat.border
                    e.currentTarget.style.boxShadow = `0 0 18px ${cat.bg.replace('0.08', '0.15')}`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 600,
                    fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span>{item.label}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
                      <path d="M3 9l6-6M5 3h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)',
                  }}>
                    {item.desc}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer note ────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 'var(--max-w-content)', margin: '0 auto',
        padding: '0 var(--section-padding-x) var(--space-16)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-10)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
        }}>
          Docs are a work in progress. Full content ships with the public release.
        </p>
        <a
          href="https://github.com/oraclous-ai"
          target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
            color: 'var(--color-text-muted)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
        >
          GitHub →
        </a>
      </div>

    </div>
  )
}
