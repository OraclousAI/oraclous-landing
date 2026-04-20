import type { Principle } from '@/types'

export const principles: Principle[] = [
  {
    ordinal: '01',
    name: 'Open Source',
    statement:
      'The platform, the agents, and the framework are all open source. No black boxes, no proprietary lock-in, no trust-us-it-works.',
  },
  {
    ordinal: '02',
    name: 'No Vendor Lock-In',
    statement:
      'Every artifact you produce — graph, datasets, model weights, agents, configs — is portable. Escape velocity is documented, not promised.',
  },
  {
    ordinal: '03',
    name: 'Data Ownership',
    statement:
      'Your data never leaves your infrastructure. Not to Oraclous. Not to any third party. Not even telemetry, unless you opt in.',
  },
  {
    ordinal: '04',
    name: 'Self-Hosted',
    statement:
      'The entire platform ships onto your infrastructure — VPC, on-prem, or sovereign cloud. No egress required. No external dependencies required.',
  },
]
