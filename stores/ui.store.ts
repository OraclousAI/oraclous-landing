import { create } from 'zustand'
import type { CursorState } from '@/types'

interface UIStore {
  /* Cursor -------------------------------------------------------- */
  cursorState: CursorState
  cursorLabel: string | null
  setCursor: (state: CursorState, label?: string) => void

  /* Loader -------------------------------------------------------- */
  isLoaderComplete: boolean
  setLoaderComplete: () => void

  /* Scroll -------------------------------------------------------- */
  scrollY: number
  setScrollY: (y: number) => void

  /* Active section (nav highlight) -------------------------------- */
  activeSection: string | null
  setActiveSection: (id: string | null) => void

  /* Motion preference --------------------------------------------- */
  prefersReducedMotion: boolean
  setPrefersReducedMotion: (value: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  cursorState: 'default',
  cursorLabel: null,
  setCursor: (state, label) => set({ cursorState: state, cursorLabel: label ?? null }),

  isLoaderComplete: false,
  setLoaderComplete: () => set({ isLoaderComplete: true }),

  scrollY: 0,
  setScrollY: (y) => set({ scrollY: y }),

  activeSection: null,
  setActiveSection: (id) => set({ activeSection: id }),

  prefersReducedMotion: false,
  setPrefersReducedMotion: (value) => set({ prefersReducedMotion: value }),
}))
