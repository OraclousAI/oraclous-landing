import type { Agent } from '@/types'

export const agents: Agent[] = [
  {
    name: 'Ingestion Agent',
    stage: 'Connect',
    stageNumber: 1,
    oneliner: 'Discovers and connects data sources — docs, DBs, APIs, code, webhooks',
    description:
      'Monitors configured data sources, detects new and updated content, and ingests raw material into the knowledge graph for downstream extraction. Supports document, database, code, API, and webhook sources.',
  },
  {
    name: 'Extraction Agent',
    stage: 'Structure',
    stageNumber: 2,
    oneliner: 'Parses raw content into typed graph entities and relationships',
    description:
      'Uses LLM-driven entity extraction with five retrieval strategies to identify typed entities and relationships from ingested raw content. Writes structured nodes and edges into the knowledge graph.',
  },
  {
    name: 'Resolution Agent',
    stage: 'Structure',
    stageNumber: 2,
    oneliner: 'Deduplicates and merges entities globally across sources',
    description:
      'Runs semantic deduplication across the entire graph, identifying SAME_AS relationships and merging entity clusters. Ensures a single canonical node per real-world entity regardless of source.',
  },
  {
    name: 'Structural Analysis Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: "Maps the graph's shape — centrality, bottlenecks, density",
    description:
      'Computes graph-level metrics: centrality scores, clustering coefficients, bottleneck nodes, and sparse subgraph regions. Outputs a structural report that feeds the Research Agent.',
  },
  {
    name: 'Coverage Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: 'Finds what\'s missing — gaps, underrepresented facts, blind spots',
    description:
      'Surfaces entities and relationship types that are present but underrepresented, and identifies known unknowns — topics that should have graph coverage but do not.',
  },
  {
    name: 'Predictive Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: 'Surfaces likely-true but unrecorded facts via link prediction',
    description:
      'Applies link prediction algorithms to identify high-confidence missing edges. These predicted facts become high-priority training data proposals — things the model probably needs but hasn\'t seen.',
  },
  {
    name: 'Causal Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: 'Traces cause-effect relationships and counterfactual paths',
    description:
      'Traverses the graph to identify causal chains and counterfactual relationships. Produces training pairs that teach the model causal reasoning, not just correlation.',
  },
  {
    name: 'Temporal Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: 'Flags stale facts, timeline contradictions, and knowledge drift',
    description:
      'Compares event_time vs ingestion_time metadata to surface outdated facts, contradictions between old and new sources, and concepts that have drifted in meaning over time.',
  },
  {
    name: 'Community Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: 'Clusters topics and builds learning-difficulty hierarchies',
    description:
      'Runs community detection (Leiden algorithm) to cluster related concepts, then orders those clusters by learning difficulty — foundational concepts first, advanced concepts last.',
  },
  {
    name: 'Semantic Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: 'Detects duplicates, behavioral patterns, and decision signatures',
    description:
      'Uses embedding similarity to detect semantic duplicates at the sentence level, identifies recurring decision patterns, and surfaces behavioral signatures across agent outputs.',
  },
  {
    name: 'Inferential Agent',
    stage: 'Analyze',
    stageNumber: 3,
    oneliner: 'Derives multi-hop reasoning chains and rule-based conclusions',
    description:
      'Traverses multi-hop paths to derive facts not explicitly stated in the graph. Applies rule-based inference to produce logical conclusions that training data should include.',
  },
  {
    name: 'Research Agent',
    stage: 'Research',
    stageNumber: 4,
    oneliner: 'Converts analysis findings into prioritized training-data proposals',
    description:
      'Reads outputs from all eight analysis agents and generates a prioritized queue of training data proposals — each with a rationale, expected impact, and recommended training technique.',
  },
  {
    name: 'Curation Agent',
    stage: 'Curate',
    stageNumber: 5,
    oneliner: 'Generates, balances, and versions training pairs',
    description:
      'Takes Research Agent proposals and generates SFT, RLHF, DPO, and ORPO training pairs. Handles class balancing, deduplication, and versioned dataset snapshots in the graph.',
  },
  {
    name: 'Strategy Agent',
    stage: 'Select',
    stageNumber: 6,
    oneliner: 'Chooses technique and hyperparameters based on goals and constraints',
    description:
      'Given the curated dataset and model objectives, selects the optimal training technique (LoRA, QLoRA, full fine-tune, DPO, ORPO) and generates a hyperparameter configuration.',
  },
  {
    name: 'Training Agent',
    stage: 'Train',
    stageNumber: 7,
    oneliner: 'Orchestrates runs, manages adapters, produces versioned checkpoints',
    description:
      'Launches training jobs on configured compute, monitors progress, handles failure recovery, and writes versioned checkpoints and adapter files back to the graph.',
  },
  {
    name: 'Evaluation Agent',
    stage: 'Evaluate',
    stageNumber: 8,
    oneliner: 'Runs RAGAS metrics and behavioral regression against baselines',
    description:
      'Gates promotion by running RAGAS evaluation metrics and behavioral regression tests against previous baselines. Blocks deployment if the model regresses on any tracked capability.',
  },
  {
    name: 'Deployment Agent',
    stage: 'Deploy',
    stageNumber: 9,
    oneliner: 'Manages canary promotion and automatic rollback',
    description:
      'Manages canary rollout to a percentage of traffic, monitors live metrics, and triggers automatic rollback if degradation is detected. Writes deployment events to the graph.',
  },
  {
    name: 'Monitor Agent',
    stage: 'Monitor',
    stageNumber: 10,
    oneliner: 'Detects drift, captures RLHF signals, triggers re-training',
    description:
      'Continuously monitors deployed model for knowledge drift and behavioral regression. Captures implicit RLHF signals from usage. Triggers re-entry at Stage 3 (Analyze) when drift exceeds threshold.',
  },
]
