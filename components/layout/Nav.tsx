'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import { EASE, DUR } from '@/lib/gsap'
import { useUIStore } from '@/stores/ui.store'
import { useMagnetic } from '@/hooks/useMagnetic'
import { useCursorState } from '@/hooks/useCursorState'
import { useTextScramble } from '@/hooks/useTextScramble'
import { openCalendly } from '@/lib/calendly'
import { useIsMobile } from '@/hooks/useMediaQuery'

/* ─── Static data ────────────────────────────────────────────────────── */

/* sectionId: used by scroll-spy on homepage; route: inner-page path if one exists */
const NAV_LINKS = [
  { href: '/#problem',      label: 'Problem',      sectionId: 'problem',      route: null },
  { href: '/architecture',  label: 'Architecture', sectionId: 'architecture', route: '/architecture' },
  { href: '/#loop',         label: 'The Loop',     sectionId: 'loop',         route: null },
  { href: '/#analysis',     label: 'Analysis',     sectionId: 'analysis',     route: null },
  { href: '/agents',        label: 'Agents',       sectionId: 'agents',       route: '/agents' },
  { href: '/roadmap',       label: 'Roadmap',      sectionId: 'roadmap',      route: '/roadmap' },
] as const

/* ─── Sub-components ─────────────────────────────────────────────────── */

function LogoMark() {
  return (
    <svg
      width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.35))' }}
    >
      <defs>
        <linearGradient id="navLogoGrad" x1="12" y1="3.5" x2="12" y2="20.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="45%" stopColor="#4361EE" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Ring */}
      <circle cx="12" cy="12" r="8.5" stroke="url(#navLogoGrad)" strokeWidth="1" />
      {/* 0° — top (cyan) */}
      <circle cx="12" cy="3.5" r="1.7" stroke="#22d3ee" strokeWidth="0.9" fill="#060610" />
      <circle cx="12" cy="3.5" r="0.65" fill="#22d3ee" />
      {/* 36° */}
      <circle cx="17.0" cy="5.1" r="1.45" stroke="#4361EE" strokeWidth="0.85" fill="#060610" />
      <circle cx="17.0" cy="5.1" r="0.55" fill="#4361EE" />
      {/* 72° */}
      <circle cx="20.1" cy="9.4" r="1.45" stroke="#4361EE" strokeWidth="0.85" fill="#060610" />
      <circle cx="20.1" cy="9.4" r="0.55" fill="#4361EE" />
      {/* 108° */}
      <circle cx="20.1" cy="14.6" r="1.45" stroke="#6b72f8" strokeWidth="0.85" fill="#060610" />
      <circle cx="20.1" cy="14.6" r="0.55" fill="#6b72f8" />
      {/* 144° */}
      <circle cx="17.0" cy="18.9" r="1.45" stroke="#8B5CF6" strokeWidth="0.85" fill="#060610" />
      <circle cx="17.0" cy="18.9" r="0.55" fill="#8B5CF6" />
      {/* 180° — bottom (violet) */}
      <circle cx="12" cy="20.5" r="1.7" stroke="#8B5CF6" strokeWidth="0.9" fill="#060610" />
      <circle cx="12" cy="20.5" r="0.65" fill="#8B5CF6" />
      {/* 216° */}
      <circle cx="7.0" cy="18.9" r="1.45" stroke="#8B5CF6" strokeWidth="0.85" fill="#060610" />
      <circle cx="7.0" cy="18.9" r="0.55" fill="#8B5CF6" />
      {/* 252° */}
      <circle cx="3.9" cy="14.6" r="1.45" stroke="#6b72f8" strokeWidth="0.85" fill="#060610" />
      <circle cx="3.9" cy="14.6" r="0.55" fill="#6b72f8" />
      {/* 288° */}
      <circle cx="3.9" cy="9.4" r="1.45" stroke="#4361EE" strokeWidth="0.85" fill="#060610" />
      <circle cx="3.9" cy="9.4" r="0.55" fill="#4361EE" />
      {/* 324° */}
      <circle cx="7.0" cy="5.1" r="1.45" stroke="#4361EE" strokeWidth="0.85" fill="#060610" />
      <circle cx="7.0" cy="5.1" r="0.55" fill="#4361EE" />
    </svg>
  )
}


interface HamburgerProps { open: boolean }
function Hamburger({ open }: HamburgerProps) {
  const base: React.CSSProperties = {
    display: 'block',
    width: '20px',
    height: '1.5px',
    backgroundColor: 'var(--color-text-primary)',
    transformOrigin: 'center',
    transition: 'transform 0.35s var(--ease-entrance), opacity 0.2s ease',
  }
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: '5px' }} aria-hidden="true">
      <span style={{ ...base, transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
      <span style={{ ...base, opacity: open ? 0 : 1 }} />
      <span style={{ ...base, transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
    </span>
  )
}

/* ─── Nav ────────────────────────────────────────────────────────────── */

export function Nav() {
  const navRef    = useRef<HTMLElement>(null)
  const menuRef   = useRef<HTMLDivElement>(null)
  const menuTlRef = useRef<gsap.core.Timeline | null>(null)

  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const isMobile = useIsMobile()

  const pathname          = usePathname()
  const isHomepage        = pathname === '/'
  const isLoaderComplete  = useUIStore((s) => s.isLoaderComplete)
  const activeSection     = useUIStore((s) => s.activeSection)
  const setActiveSection  = useUIStore((s) => s.setActiveSection)
  const githubRef                             = useMagnetic<HTMLAnchorElement>(0.35)
  const { onHoverEnter, onHoverLeave }        = useCursorState()
  const { ref: logoTextRef, scramble }        = useTextScramble<HTMLSpanElement>()

  /* Scroll state ---------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Scroll-spy — homepage only, uses sectionId -------------------- */
  useEffect(() => {
    if (!isHomepage) return
    const ids = NAV_LINKS.map(l => l.sectionId)
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [isHomepage, setActiveSection])

  /* Nav entrance after loader --------------------------------------- */
  useEffect(() => {
    const el = navRef.current
    if (!isLoaderComplete || !el) return
    gsap.fromTo(
      el,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: DUR.emphasis, ease: EASE.entrance, delay: 0.1 },
    )
  }, [isLoaderComplete])

  /* Mobile menu GSAP timeline --------------------------------------- */
  useEffect(() => {
    const el = menuRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      menuTlRef.current = gsap.timeline({ paused: true })
        .set(el, { display: 'flex' })
        .fromTo(el,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' },
        )
        .fromTo(
          '[data-menu-link]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.45, ease: EASE.entrance },
          '<0.05',
        )
        .fromTo(
          '[data-menu-cta]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, ease: EASE.entrance },
          '<0.1',
        )
    }, menuRef)

    return () => ctx.revert()
  }, [])

  /* Open/close menu ------------------------------------------------- */
  useEffect(() => {
    if (menuOpen) {
      menuTlRef.current?.play()
      document.body.style.overflow = 'hidden'
    } else {
      menuTlRef.current?.reverse()
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  /* Shared link hover handlers ------------------------------------- */
  const onLinkEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.style.backgroundColor) return
    e.currentTarget.style.color = 'var(--color-text-primary)'
    onHoverEnter()
  }, [onHoverEnter])
  const onLinkLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>, isActive: boolean) => {
    if (!isActive) e.currentTarget.style.color = 'var(--color-text-tertiary)'
    onHoverLeave()
  }, [onHoverLeave])

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Fixed nav bar ────────────────────────────────────────── */}
      <nav
        ref={navRef}
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-sticky)',
          opacity: 0,
          transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
          backgroundColor: scrolled ? 'rgba(6, 6, 14, 0.52)' : 'transparent',
          backdropFilter: scrolled ? 'blur(32px) saturate(180%) brightness(0.95)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(180%) brightness(0.95)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.28)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-w-content)',
            margin: '0 auto',
            padding: '0 var(--section-padding-x)',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onMouseEnter={() => { onHoverEnter(); scramble('Oraclous') }}
            onMouseLeave={onHoverLeave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <LogoMark />
            <span
              ref={logoTextRef}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Oraclous
            </span>
          </Link>

          {/* Desktop links */}
          <nav
            aria-label="Site sections"
            style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '2.5rem' }}
          >
            {NAV_LINKS.map(({ href, label, sectionId, route }) => {
              const isActive = route
                ? pathname === route
                : isHomepage && activeSection === sectionId
              return (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={onLinkEnter}
                  onMouseLeave={(e) => onLinkLeave(e, isActive)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    transition: 'color 0.2s, background-color 0.2s, box-shadow 0.2s',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                    border: isActive ? '1px solid rgba(255,255,255,0.13)' : '1px solid transparent',
                    boxShadow: isActive
                      ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 12px rgba(0,0,0,0.35), 0 0 16px rgba(67,97,238,0.15)'
                      : 'none',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Book a Call CTA — desktop */}
            <a
              ref={githubRef}
              href="#"
              onClick={(e) => { e.preventDefault(); openCalendly() }}
              style={{
                display: isMobile ? 'none' : 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1.1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                background: 'var(--gradient-accent)',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--glow-accent-sm)',
                transition: 'opacity 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-md)'; onHoverEnter('book') }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-sm)'; onHoverLeave() }}
            >
              Book a Call
            </a>

            {/* Hamburger — mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                display: isMobile ? 'flex' : 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.75rem',
                minWidth: '44px',
                minHeight: '44px',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 'calc(var(--z-drawer) + 1)',
                position: 'relative',
              }}
            >
              <Hamburger open={menuOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay ────────────────────────────── */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        inert={!menuOpen || undefined}
        suppressHydrationWarning
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'var(--z-drawer)',
          backgroundColor: 'rgba(3, 3, 5, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'none',  /* set to flex by GSAP timeline */
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '6rem var(--section-padding-x) 3rem',
        }}
      >
        {/* Mobile nav links */}
        <nav
          aria-label="Mobile site sections"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              data-menu-link=""
              onClick={closeMenu}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'var(--text-3xl)',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                lineHeight: 'var(--leading-snug)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu footer */}
        <div
          data-menu-cta=""
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); closeMenu(); openCalendly() }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '44px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--color-text-accent)',
              textDecoration: 'none',
            }}
          >
            Book a Free AI Strategy Call →
          </a>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            MIT License · Open Source · Self-Hosted
          </p>
        </div>
      </div>
    </>
  )
}
