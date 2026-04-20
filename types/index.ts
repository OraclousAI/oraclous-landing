/* ============================================================
   Cursor
   ============================================================ */

export type CursorState = 'default' | 'hover' | 'drag' | 'text' | 'hidden'

/* ============================================================
   Content — mirrors content/*.ts data shapes
   ============================================================ */

export interface Agent {
  name: string
  stage: string
  stageNumber: number
  oneliner: string
  description: string
}

export interface Principle {
  ordinal: string
  name: string
  statement: string
}

export interface LoopStage {
  number: number
  name: string
  description: string
  agentName: string
}

export interface AnalysisFamily {
  number: number
  name: string
  oneliner: string
  description: string
}

export interface Metric {
  value: string
  label: string
}

export type RoadmapStatus = 'shipped' | 'in-progress' | 'committed'

export interface RoadmapItem {
  label: string
  status: RoadmapStatus
  layer?: 1 | 2 | 3
}

export interface ProductLine {
  name: string
  badge: string
  tagline: string
  body: string
  cta: string
  includes: string
}
