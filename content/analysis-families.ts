import type { AnalysisFamily } from '@/types'

export const analysisFamilies: AnalysisFamily[] = [
  {
    number: 1,
    name: 'Structural',
    oneliner: 'Find bottlenecks, sparse areas, and high-centrality nodes',
    description:
      'Computes centrality scores, clustering coefficients, and graph density. Identifies nodes that are over-connected (potential bottlenecks) or under-connected (sparse knowledge regions).',
  },
  {
    number: 2,
    name: 'Coverage & Gap',
    oneliner: 'Surface missing entities and underrepresented relationships',
    description:
      'Maps what should be in the graph versus what is. Identifies topics with insufficient coverage, relationship types that appear inconsistently, and entities that exist but lack key attributes.',
  },
  {
    number: 3,
    name: 'Predictive',
    oneliner: "Identify likely-true facts your model hasn't been trained on",
    description:
      'Applies link prediction to surface high-confidence missing edges. These are facts that the graph structure implies are true but have not been explicitly stated — high-value training candidates.',
  },
  {
    number: 4,
    name: 'Causal & Counterfactual',
    oneliner: "Understand why things happen and what would change if they didn't",
    description:
      'Traverses causal chains in the graph and generates counterfactual training examples. Teaches the model to reason about cause and effect, not just pattern-match on correlations.',
  },
  {
    number: 5,
    name: 'Temporal & Drift',
    oneliner: 'Detect stale facts and contradictions across time',
    description:
      'Uses bitemporal tracking to surface facts that have changed or been contradicted over time. Flags knowledge drift before it degrades model outputs in production.',
  },
  {
    number: 6,
    name: 'Community & Hierarchy',
    oneliner: 'Cluster topics and order concepts by learning difficulty',
    description:
      'Runs community detection (Leiden algorithm) to identify topic clusters, then orders them by prerequisite structure. Ensures training data is sequenced from foundational to advanced.',
  },
  {
    number: 7,
    name: 'Semantic & Behavioral',
    oneliner: 'Find duplicates, patterns, and decision signatures',
    description:
      'Uses embedding similarity to deduplicate at the semantic level, identifies recurring behavioral patterns in agent outputs, and surfaces decision signatures that could bias training.',
  },
  {
    number: 8,
    name: 'Inferential & Reasoning',
    oneliner: 'Derive multi-hop chains and logic-based facts',
    description:
      'Traverses multi-hop paths to derive facts not explicitly present. Applies rule-based inference to produce logical conclusions. Generates training data for reasoning chains, not just direct recall.',
  },
]
