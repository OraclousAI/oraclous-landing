'use client'

import { useActiveSectionObserver } from '@/hooks/useActiveSectionObserver'
import {
  HeroSection,
  MetricsSection,
  ProblemSection,
  FTOpsSection,
  ArchitectureSection,
  LoopSection,
  AnalysisSection,
  AgentsSection,
  WhyKGSection,
  PrinciplesSection,
  ProductsSection,
  RoadmapSection,
  CtaSection,
} from '@/components/sections'

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
