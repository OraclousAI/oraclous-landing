'use client'

import { useState, useEffect } from 'react'

export type Role = 'CTO' | 'ML Engineer' | 'DevOps Lead' | 'Founder'

export const HERO_SUBS: Record<Role, string> = {
  'CTO':
    'Your ML team spends the majority of their time on dataset prep and training scripts instead of capability gaps. Oraclous turns the entire pipeline into a 10-stage automated loop — zero data leaves your infra.',
  'ML Engineer':
    'Stop writing one-off curation scripts. Oraclous gives you 18 specialist agents and a knowledge graph that continuously surfaces training data from your actual domain knowledge — automatically.',
  'DevOps Lead':
    "Fine-tuning has no operational discipline. FTOps is DevOps for weights — version-controlled, HITL-gated, rollback-ready, and continuously monitored.",
  'Founder':
    'Your competitive moat is your domain knowledge. Oraclous automatically turns that knowledge into model weights — on your infra, under MIT license, without engineering overhead.',
}

const ROLES: Role[] = ['CTO', 'ML Engineer', 'DevOps Lead', 'Founder']
const SESSION_KEY = 'oraclous-role'

interface Props {
  onRoleChange?: (role: Role) => void
}

export function RoleSelector({ onRoleChange }: Props) {
  const [selected, setSelected] = useState<Role | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY) as Role | null
    if (stored && ROLES.includes(stored)) {
      setSelected(stored)
      onRoleChange?.(stored)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const select = (role: Role) => {
    setSelected(role)
    sessionStorage.setItem(SESSION_KEY, role)
    onRoleChange?.(role)
    window.dispatchEvent(new CustomEvent('oraclous:role', { detail: role }))
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          flexShrink: 0,
        }}
      >
        Personalize for:
      </span>
      {ROLES.map(role => (
        <button
          key={role}
          type="button"
          data-role-btn=""
          onClick={() => select(role)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            border: `1px solid ${selected === role ? 'var(--color-accent)' : 'var(--color-border)'}`,
            background: selected === role ? 'var(--color-accent-dim)' : 'transparent',
            color: selected === role ? 'var(--color-text-accent)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {role}
        </button>
      ))}
    </div>
  )
}
