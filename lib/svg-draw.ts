import { gsap } from '@/lib/gsap'

/**
 * Primes an SVG path for a draw-in animation.
 * Call this before animateDraw — sets dasharray to path length, dashoffset to full length.
 */
export function prepareDraw(el: SVGPathElement): number {
  const len = el.getTotalLength()
  gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
  return len
}

/**
 * Animates the path drawing from invisible to fully drawn.
 * Pass ScrollTrigger config via vars.scrollTrigger to tie to scroll.
 */
export function animateDraw(el: SVGPathElement, vars?: gsap.TweenVars): gsap.core.Tween {
  return gsap.to(el, {
    strokeDashoffset: 0,
    ease: 'power2.inOut',
    duration: 1.2,
    ...vars,
  })
}

/** Resets a path to un-drawn state without animation. */
export function resetDraw(el: SVGPathElement): void {
  const len = el.getTotalLength()
  gsap.set(el, { strokeDashoffset: len })
}
