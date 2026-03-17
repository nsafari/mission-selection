import type { DimensionScore } from './dimension-score.model';

export interface EvaluatedItem {
  id: string;
  topicTitle: string;
  dimensionScores: DimensionScore[];
  finalScore: number;
  createdAt: Date;
}
