import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip)
}

export { gsap, ScrollTrigger, SplitText, Flip }

/* Named easing constants — mirrors tokens.css, usable in GSAP calls */
export const EASE = {
  entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
  exit:     'cubic-bezier(0.7, 0, 1, 1)',
  emphasis: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  scrub:    'linear',
} as const

/* Named duration constants in seconds (GSAP uses seconds, CSS uses ms) */
export const DUR = {
  fast:      0.15,
  standard:  0.5,
  emphasis:  0.8,
  cinematic: 1.4,
} as const

/* Stagger values in seconds */
export const STAGGER = {
  siblings: 0.06,
  section:  0.12,
} as const
