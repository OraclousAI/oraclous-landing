import { useLenisInstance } from '@/providers/SmoothScrollProvider'

/** Returns the active Lenis instance, or null before it initialises. */
export function useLenis() {
  return useLenisInstance()
}
