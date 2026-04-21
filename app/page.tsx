'use client'

import dynamic from 'next/dynamic'
import { useActiveSectionObserver } from '@/hooks/useActiveSectionObserver'
import { HeroSection }    from '@/components/sections/HeroSection'
import { MetricsSection } from '@/components/sections/MetricsSection'

function SectionBridge({ text }: { text: string }) {
  return (
    <div style={{
      maxWidth: 'var(--max-w-content)',
      margin: '0 auto',
      padding: '0 var(--section-padding-x)',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1.25rem 0', textAlign: 'center',
        lineHeight: 'var(--leading-relaxed)',
      }}>
        {text}
      </p>
    </div>
  )
}

/* ─── Below-fold sections — code-split for faster initial load ─────── */

const ProblemSection = dynamic(() =>
  import('@/components/sections/ProblemSection').then(m => ({ default: m.ProblemSection }))
)
const FTOpsSection = dynamic(() =>
  import('@/components/sections/FTOpsSection').then(m => ({ default: m.FTOpsSection }))
)
const ProductsSection = dynamic(() =>
  import('@/components/sections/ProductsSection').then(m => ({ default: m.ProductsSection }))
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
const RoadmapSection = dynamic(() =>
  import('@/components/sections/RoadmapSection').then(m => ({ default: m.RoadmapSection }))
)
const CtaSection = dynamic(() =>
  import('@/components/sections/CtaSection').then(m => ({ default: m.CtaSection }))
)

/* ─── Observed section IDs for nav scroll-spy ─────────────────────── */

const OBSERVED_SECTIONS = [
  'problem',
  'products',
  'architecture',
  'loop',
  'agents',
  'cta',
] as const

export default function HomePage() {
  useActiveSectionObserver(OBSERVED_SECTIONS)

  return (
    <main style={{ backgroundColor: 'var(--color-bg-void)' }}>
      <HeroSection />
      <SectionBridge text="Before the product: the problem it exists to solve." />
      <ProblemSection />
      <SectionBridge text="There's a common root cause behind all three: fine-tuning has never had its own operational framework. That's what we built." />
      <FTOpsSection />
      <SectionBridge text="FTOps needs a product suite to run on. Here's what you can deploy today." />
      <ProductsSection />
      <SectionBridge text="Three products, one foundation. Here's the architecture that connects all three layers." />
      <ArchitectureSection />
      <SectionBridge text="Layer 3 — the FTOps team — runs on a specific 10-stage loop. Here's exactly how it works." />
      <LoopSection />
      <SectionBridge text="Stage 3 runs 8 analysis agents in parallel. Here's who they are and what they're looking for." />
      <AnalysisSection />
      <AgentsSection />
      <MetricsSection />
      <RoadmapSection />
      <CtaSection />
    </main>
  )
}
