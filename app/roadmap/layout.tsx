import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'Track what the Oraclous team has shipped, what is actively being built, and the forward commitments across all three platform layers.',
  alternates: { canonical: '/roadmap' },
  openGraph: {
    title: 'Roadmap | Oraclous',
    description:
      'Oraclous public roadmap: shipped features, active development, and committed future work across the Knowledge Graph, Agent Framework, and FTOps layers.',
  },
  twitter: {
    title: 'Roadmap | Oraclous',
    description:
      'Oraclous public roadmap: shipped, in-progress, and committed work across all three platform layers.',
  },
}

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
