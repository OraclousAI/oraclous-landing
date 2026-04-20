import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Architecture',
  description:
    'The three-layer architecture powering Oraclous: a Knowledge Graph foundation, autonomous agent framework, and continuous FTOps pipeline — all self-hosted on your infrastructure.',
  alternates: { canonical: '/architecture' },
  openGraph: {
    title: 'Architecture | Oraclous',
    description:
      'Three-layer FTOps architecture: Knowledge Graph → Agent Framework → Continuous Fine-Tuning. Self-hosted, zero vendor lock-in.',
  },
  twitter: {
    title: 'Architecture | Oraclous',
    description:
      'Three-layer FTOps architecture: Knowledge Graph → Agent Framework → Continuous Fine-Tuning.',
  },
}

export default function ArchitectureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
