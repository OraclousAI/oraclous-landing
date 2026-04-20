import type { RoadmapItem } from '@/types'

export const roadmapItems: RoadmapItem[] = [
  /* Shipped --------------------------------------------------- */
  { label: 'Multi-tenant knowledge graph on Neo4j',                       status: 'shipped',     layer: 1 },
  { label: 'LLM-driven entity extraction with 5 retrieval strategies',    status: 'shipped',     layer: 1 },
  { label: 'ReBAC access control with service accounts and key rotation', status: 'shipped',     layer: 1 },
  { label: 'Zero-copy versioning + cross-graph federation',               status: 'shipped',     layer: 1 },
  { label: 'Document, database, code, and multimodal ingestion',          status: 'shipped',     layer: 1 },
  { label: '15+ MCP tools',                                               status: 'shipped',     layer: 2 },
  { label: 'Agent memory with decay modeling',                            status: 'shipped',     layer: 2 },
  { label: 'RAGAS evaluation framework',                                  status: 'shipped',     layer: 2 },
  { label: 'Credential broker service',                                   status: 'shipped',     layer: 1 },
  { label: '88 issues shipped, 58+ test suites',                          status: 'shipped' },

  /* In Progress ----------------------------------------------- */
  { label: 'True bitemporal tracking (event_time / ingestion_time)',       status: 'in-progress', layer: 1 },
  { label: 'Hierarchical community summaries (Leiden algorithm)',          status: 'in-progress', layer: 1 },
  { label: 'Semantic federation with SAME_AS deduplication',               status: 'in-progress', layer: 1 },
  { label: 'Code data-flow analysis',                                      status: 'in-progress', layer: 1 },
  { label: 'Visual Flow Studio MVP',                                       status: 'in-progress', layer: 2 },
  { label: 'Layer 2 exposed as standalone product',                        status: 'in-progress', layer: 2 },
  { label: 'Published benchmarks',                                         status: 'in-progress' },

  /* Committed ------------------------------------------------- */
  { label: 'All eight analysis family agents',                             status: 'committed',   layer: 3 },
  { label: 'All eight research agents',                                    status: 'committed',   layer: 3 },
  { label: 'Dataset curation agents',                                      status: 'committed',   layer: 3 },
  { label: 'Strategy agents',                                              status: 'committed',   layer: 3 },
  { label: 'Training agents (SFT, LoRA, QLoRA, DPO, ORPO)',               status: 'committed',   layer: 3 },
  { label: 'Evaluation and deployment agents',                             status: 'committed',   layer: 3 },
  { label: 'Monitor agents with drift detection',                          status: 'committed',   layer: 3 },
  { label: 'HITL approval UIs at every stage',                             status: 'committed',   layer: 3 },
  { label: 'Periodic retrain scheduling',                                  status: 'committed',   layer: 3 },
]
