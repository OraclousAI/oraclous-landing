'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { EASE, DUR } from '@/lib/gsap'
import { useUIStore } from '@/stores/ui.store'
import { useMagnetic } from '@/hooks/useMagnetic'

/* ─── Static data ────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '#problem',      label: 'Problem' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#loop',         label: 'The Loop' },
  { href: '#analysis',     label: 'Analysis' },
  { href: '#agents',       label: 'Agents' },
  { href: '#roadmap',      label: 'Roadmap' },
] as const

/* ─── Sub-components ─────────────────────────────────────────────────── */

function LogoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect
        x="2" y="2" width="14" height="14" rx="3"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 5px var(--color-accent-glow))' }}
      />
      <rect x="6" y="6" width="6" height="6" rx="1.5" fill="var(--color-accent)" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
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

  const isLoaderComplete = useUIStore((s) => s.isLoaderComplete)
  const activeSection    = useUIStore((s) => s.activeSection)
  const githubRef        = useMagnetic<HTMLAnchorElement>(0.35)

  /* Scroll state ---------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    e.currentTarget.style.color = 'var(--color-text-primary)'
  }, [])
  const onLinkLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>, isActive: boolean) => {
    if (!isActive) e.currentTarget.style.color = 'var(--color-text-tertiary)'
  }, [])

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
            style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const id       = href.replace('#', '')
              const isActive = activeSection === id
              return (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={onLinkEnter}
                  onMouseLeave={(e) => onLinkLeave(e, isActive)}
                  style={{
                    position: 'relative',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    paddingBottom: '2px',
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        boxShadow: 'var(--glow-accent-sm)',
                      }}
                    />
                  )}
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
              onClick={(e) => {
                e.preventDefault()
                ;(window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/reza-oraclous/consultancy-with-reza-oraclous' })
              }}
              className="hidden md:inline-flex"
              style={{
                display: 'none',
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
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-md)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--glow-accent-sm)' }}
            >
              Book a Call
            </a>

            {/* Hamburger — mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="flex md:hidden"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
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
        aria-hidden={!menuOpen}
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
            onClick={(e) => {
              e.preventDefault()
              closeMenu()
              ;(window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/reza-oraclous/consultancy-with-reza-oraclous' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
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
