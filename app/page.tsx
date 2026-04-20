'use client'

import dynamic from 'next/dynamic'
import { useActiveSectionObserver } from '@/hooks/useActiveSectionObserver'
import { HeroSection }    from '@/components/sections/HeroSection'
import { MetricsSection } from '@/components/sections/MetricsSection'

/* ─── Below-fold sections — code-split for faster initial load ─────── */

const ProblemSection = dynamic(() =>
  import('@/components/sections/ProblemSection').then(m => ({ default: m.ProblemSection }))
)
const FTOpsSection = dynamic(() =>
  import('@/components/sections/FTOpsSection').then(m => ({ default: m.FTOpsSection }))
)
const ArchitectureSection = dynamic(() =>
  import('@/components/sections/ArchitectureSection').then(m => ({ default: m.ArchitectureSection }))
)
const LoopSection = dynamic(() =>
  import('@/components/sections/LoopSection').then(m => ({ default: m.LoopSection }))
)
const AnalysisSection = dynamic(() =>
  import('@/components/sections/AnalysisSection').then(m => ({ default: m.AnalysisSection }))
)
const AgentsSection = dynamic(() =>
  import('@/components/sections/AgentsSection').then(m => ({ default: m.AgentsSection }))
)
const WhyKGSection = dynamic(() =>
  import('@/components/sections/WhyKGSection').then(m => ({ default: m.WhyKGSection }))
)
const PrinciplesSection = dynamic(() =>
  import('@/components/sections/PrinciplesSection').then(m => ({ default: m.PrinciplesSection }))
)
const ProductsSection = dynamic(() =>
  import('@/components/sections/ProductsSection').then(m => ({ default: m.ProductsSection }))
)
const RoadmapSection = dynamic(() =>
  import('@/components/sections/RoadmapSection').then(m => ({ default: m.RoadmapSection }))
)
const CtaSection = dynamic(() =>
  import('@/components/sections/CtaSection').then(m => ({ default: m.CtaSection }))
)

/* ─── Observed section IDs for nav scroll-spy ─────────────────────── */

const OBSERVED_SECTIONS = [
  'architecture',
  'loop',
  'agents',
  'roadmap',
] as const

export default function HomePage() {
  useActiveSectionObserver(OBSERVED_SECTIONS)

  return (
    <main style={{ backgroundColor: 'var(--color-bg-void)' }}>
      <HeroSection />
      <MetricsSection />
      <ProblemSection />
      <FTOpsSection />
      <ArchitectureSection />
      <LoopSection />
      <AnalysisSection />
      <AgentsSection />
      <WhyKGSection />
      <PrinciplesSection />
      <ProductsSection />
      <RoadmapSection />
      <CtaSection />
    </main>
  )
}
