'use client'

import { useUIStore } from '@/stores/ui.store'

const STORY_SECTIONS = [
  { id: 'problem',      label: 'Problem' },
  { id: 'ftops',        label: 'FTOps' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'loop',         label: 'The Loop' },
  { id: 'agents',       label: 'Agents' },
  { id: 'cta',          label: 'Get Started' },
]

export function StoryProgress() {
  const activeSection = useUIStore(s => s.activeSection)
  const activeIndex = STORY_SECTIONS.findIndex(s => s.id === activeSection)

  if (activeIndex < 0) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 'var(--z-sticky)' as React.CSSProperties['zIndex'],
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(13,13,26,0.88)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-full)',
        padding: '0.4rem 1rem',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        pointerEvents: 'auto',
      }}
    >
      {STORY_SECTIONS.map((section, i) => (
        <button
          key={section.id}
          type="button"
          title={section.label}
          onClick={() =>
            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
          }
          style={{
            width: i === activeIndex ? '28px' : '6px',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            background:
              i <= activeIndex ? 'var(--color-accent)' : 'var(--color-border-strong)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
            padding: 0,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}
