import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agent Team',
  description:
    'Meet the 18 specialist agents that run your fine-tuning pipeline — from data ingestion and knowledge graph construction to training, evaluation, and continuous deployment.',
  openGraph: {
    title: 'Agent Team | Oraclous',
    description:
      '18 specialist AI agents covering all 10 stages of the FTOps loop: Connect, Structure, Analyze, Research, Curate, Select, Train, Evaluate, Deploy, Monitor.',
  },
  twitter: {
    title: 'Agent Team | Oraclous',
    description:
      '18 specialist AI agents covering all 10 stages of the FTOps loop.',
  },
}

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
