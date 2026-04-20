'use client'

import { FadeUp, TextReveal, WordReveal, LineReveal, CountUp, ParallaxLayer, ScrubTimeline, PinSection } from '@/components/animation'
import { useHoverTilt } from '@/hooks/useHoverTilt'
import { useTextScramble } from '@/hooks/useTextScramble'
import { useMagnetic } from '@/hooks/useMagnetic'

/* ─── Shared styles ─────────────────────────────────────────────────── */

const cell = {
  padding: '3rem 0',
  borderBottom: '1px solid var(--color-border)',
} as const

const label = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-tertiary)',
  letterSpacing: 'var(--tracking-widest)',
  textTransform: 'uppercase' as const,
  marginBottom: '1.5rem',
}

const desc = {
  marginTop: '1rem',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-muted)',
  maxWidth: '480px',
}

/* ─── FadeUp demo ───────────────────────────────────────────────────── */

function FadeUpDemo() {
  return (
    <div style={cell}>
      <p style={label}>01 — FadeUp</p>
      <FadeUp once={false}>
        <p style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
          This block fades up when it enters the viewport.
        </p>
      </FadeUp>
      <p style={desc}>y + opacity entrance. Most frequently used primitive. Reverses on scroll-back when once=false.</p>
    </div>
  )
}

/* ─── TextReveal demo ───────────────────────────────────────────────── */

function TextRevealDemo() {
  return (
    <div style={cell}>
      <p style={label}>02 — TextReveal (SplitText chars)</p>
      <TextReveal
        as="h2"
        once={false}
        style={{
          fontSize: 'var(--text-3xl)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 'var(--leading-tight)',
        } as React.CSSProperties}
      >
        Character by character — precision at the letter level.
      </TextReveal>
      <p style={desc}>GSAP SplitText splits text into individual chars. Each animates with stagger.</p>
    </div>
  )
}

/* ─── WordReveal demo ───────────────────────────────────────────────── */

function WordRevealDemo() {
  return (
    <div style={cell}>
      <p style={label}>03 — WordReveal (mask clip)</p>
      <WordReveal
        as="h2"
        once={false}
        className="font-display font-bold"
        style={{
          fontSize: 'var(--text-4xl)',
          color: 'var(--color-text-primary)',
          lineHeight: 'var(--leading-tight)',
        } as React.CSSProperties}
      >
        Words slide up from behind a mask.
      </WordReveal>
      <p style={desc}>Each word wrapped in overflow-hidden. Inner span slides from translateY(110%). No SplitText dependency.</p>
    </div>
  )
}

/* ─── LineReveal demo ───────────────────────────────────────────────── */

function LineRevealDemo() {
  return (
    <div style={cell}>
      <p style={label}>04 — LineReveal</p>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>
          Left origin (default)
        </p>
        <LineReveal once={false} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>
          Center origin
        </p>
        <LineReveal once={false} origin="center" color="var(--color-accent)" thickness={2} />
      </div>
      <div>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>
          Right origin
        </p>
        <LineReveal once={false} origin="right" color="var(--color-secondary)" />
      </div>
      <p style={desc}>scaleX: 0 → 1 with configurable transformOrigin. Decorative dividers, section separators.</p>
    </div>
  )
}

/* ─── CountUp demo ──────────────────────────────────────────────────── */

function CountUpDemo() {
  return (
    <div style={cell}>
      <p style={label}>05 — CountUp</p>
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <div>
          <CountUp
            to={88}
            suffix="+"
            once={false}
            style={{
              fontSize: 'var(--text-5xl)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              tabularNums: true,
            } as React.CSSProperties}
          />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>Shipped issues</p>
        </div>
        <div>
          <CountUp
            to={58}
            suffix="+"
            once={false}
            style={{
              fontSize: 'var(--text-5xl)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-accent)',
              tabularNums: true,
            } as React.CSSProperties}
          />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>Test suites</p>
        </div>
        <div>
          <CountUp
            to={99.7}
            suffix="%"
            decimals={1}
            once={false}
            style={{
              fontSize: 'var(--text-5xl)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-warm)',
              tabularNums: true,
            } as React.CSSProperties}
          />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>Graph accuracy</p>
        </div>
        <div>
          <CountUp
            to={0}
            prefix="$"
            once={false}
            style={{
              fontSize: 'var(--text-5xl)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              tabularNums: true,
            } as React.CSSProperties}
          />
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>Vendor lock-in</p>
        </div>
      </div>
      <p style={desc}>GSAP tween on a counter object. Supports prefix, suffix, decimals. Scroll-triggered.</p>
    </div>
  )
}

/* ─── ParallaxLayer demo ────────────────────────────────────────────── */

function ParallaxLayerDemo() {
  return (
    <div style={{ ...cell, height: '400px', position: 'relative', overflow: 'hidden' }}>
      <p style={{ ...label, position: 'relative', zIndex: 2 }}>06 — ParallaxLayer</p>
      <ParallaxLayer speed={0.5} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties}>
        <div
          style={{
            width: '320px',
            height: '220px',
            background: 'var(--gradient-subtle)',
            border: '1px solid var(--color-border-accent)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
            speed=0.5 (slow layer)
          </p>
        </div>
      </ParallaxLayer>
      <p style={{ ...desc, position: 'relative', zIndex: 2, marginTop: '260px' }}>
        ScrollTrigger scrub + yPercent. Positive speed = moves against scroll (foreground). Negative = background.
      </p>
    </div>
  )
}

/* ─── ScrubTimeline demo ────────────────────────────────────────────── */

function ScrubTimelineDemo() {
  return (
    <div style={cell}>
      <p style={label}>07 — ScrubTimeline</p>
      <div style={{ height: '12px', background: 'var(--color-bg-surface)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
        <ScrubTimeline
          start="top 80%"
          end="bottom 20%"
          setup={(tl, el) => {
            const bar = el.querySelector('[data-scrub-bar]') as HTMLElement | null
            if (bar) tl.fromTo(bar, { width: '0%' }, { width: '100%', ease: 'none' })
          }}
        >
          <div
            data-scrub-bar=""
            style={{ height: '100%', background: 'var(--gradient-accent)', borderRadius: '4px' }}
          />
        </ScrubTimeline>
      </div>
      <p style={desc}>
        Timeline progress is mapped directly to scroll progress. Pin + scrub for scroll-jacked hero
        sequences. This bar fills as you scroll past it.
      </p>
    </div>
  )
}

/* ─── PinSection demo ───────────────────────────────────────────────── */

function PinSectionDemo() {
  return (
    <div style={cell}>
      <p style={label}>08 — PinSection</p>
      <PinSection end="+=80%" pinSpacing={true}>
        <div
          style={{
            height: '280px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>
            This section pins
          </p>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
            Scroll down to continue
          </p>
        </div>
      </PinSection>
      <p style={desc}>ScrollTrigger pin: true. Use for architecture diagram panels, feature reveals, step sequences.</p>
    </div>
  )
}

/* ─── useHoverTilt demo ─────────────────────────────────────────────── */

function HoverTiltDemo() {
  const ref = useHoverTilt({ max: 12 })
  return (
    <div style={cell}>
      <p style={label}>09 — useHoverTilt</p>
      <div ref={ref} style={{ display: 'inline-flex' }}>
        <div
          style={{
            width: '280px',
            height: '180px',
            background: 'var(--gradient-subtle)',
            border: '1px solid var(--color-border-accent)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
          }}
        >
          <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
            Hover me
          </p>
        </div>
      </div>
      <p style={desc}>Perspective tilt follows cursor. Springs back on leave via elastic.out. Great for cards, CTAs.</p>
    </div>
  )
}

/* ─── useTextScramble demo ──────────────────────────────────────────── */

function TextScrambleDemo() {
  const { ref, scramble } = useTextScramble<HTMLSpanElement>()
  return (
    <div style={cell}>
      <p style={label}>10 — useTextScramble</p>
      <span
        ref={ref}
        onMouseEnter={() => scramble('SOVEREIGN. PRECISE. RELENTLESS.')}
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xl)',
          color: 'var(--color-accent)',
          letterSpacing: '0.08em',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        HOVER TO SCRAMBLE THIS TEXT
      </span>
      <p style={desc}>rAF-based char scramble. Reveals correct chars left-to-right. Zero GSAP dependency. Respects reduced motion.</p>
    </div>
  )
}

/* ─── useMagnetic demo ──────────────────────────────────────────────── */

function MagneticDemo() {
  const ref = useMagnetic<HTMLButtonElement>(0.5)
  return (
    <div style={cell}>
      <p style={label}>11 — useMagnetic</p>
      <button
        ref={ref}
        type="button"
        style={{
          padding: '1rem 2.5rem',
          background: 'transparent',
          border: '1px solid var(--color-accent)',
          borderRadius: '999px',
          color: 'var(--color-accent)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          letterSpacing: 'var(--tracking-wide)',
          cursor: 'pointer',
          display: 'inline-block',
        }}
      >
        MAGNETIC PULL
      </button>
      <p style={desc}>GSAP quickTo for smooth magnetic attraction. Elastic spring on release. Ideal for CTA buttons.</p>
    </div>
  )
}

/* ─── Root export ───────────────────────────────────────────────────── */

export function AnimationDemos() {
  return (
    <div>
      <FadeUpDemo />
      <TextRevealDemo />
      <WordRevealDemo />
      <LineRevealDemo />
      <CountUpDemo />
      <ParallaxLayerDemo />
      <ScrubTimelineDemo />
      <PinSectionDemo />
      <HoverTiltDemo />
      <TextScrambleDemo />
      <MagneticDemo />
    </div>
  )
}
