import type { LoopStage } from '@/types'

export const loopStages: LoopStage[] = [
  {
    number: 1,
    name: 'Connect',
    description: 'Ingest docs, databases, APIs, code, and webhooks into the graph',
    agentName: 'Ingestion Agent',
  },
  {
    number: 2,
    name: 'Structure',
    description: 'Extract entities and relationships; resolve duplicates globally',
    agentName: 'Extraction Agent + Resolution Agent',
  },
  {
    number: 3,
    name: 'Analyze',
    description: 'Run eight parallel graph analyses to find gaps and opportunities',
    agentName: '8 Analysis Agents',
  },
  {
    number: 4,
    name: 'Research',
    description: 'Convert analysis findings into prioritized training-data proposals',
    agentName: 'Research Agent',
  },
  {
    number: 5,
    name: 'Curate',
    description: 'Generate and balance SFT, RLHF, DPO, and ORPO training pairs',
    agentName: 'Curation Agent',
  },
  {
    number: 6,
    name: 'Select',
    description: 'Choose the right technique: LoRA, QLoRA, full fine-tune, DPO, ORPO',
    agentName: 'Strategy Agent',
  },
  {
    number: 7,
    name: 'Train',
    description: 'Orchestrate training on your compute; produce versioned checkpoints',
    agentName: 'Training Agent',
  },
  {
    number: 8,
    name: 'Evaluate',
    description: 'Gate promotion with RAGAS metrics and behavioral regression tests',
    agentName: 'Evaluation Agent',
  },
  {
    number: 9,
    name: 'Deploy',
    description: 'Canary → production promotion; automatic rollback on regression',
    agentName: 'Deployment Agent',
  },
  {
    number: 10,
    name: 'Monitor',
    description: 'Detect drift, capture RLHF signals, re-enter at Stage 3',
    agentName: 'Monitor Agent',
  },
]
