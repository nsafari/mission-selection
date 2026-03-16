import { Injectable } from '@angular/core';
import type { DimensionScore } from '../models/dimension-score.model';
import type { EvaluationDimension } from '../models/evaluation-dimension.model';

@Injectable({ providedIn: 'root' })
export class CalculationService {
  /**
   * Final score: Σ(Score_i × Weight_i)
   * Weights are normalized so they sum to 1.
   */
  calculateFinalScore(
    dimensionScores: DimensionScore[],
    dimensions: EvaluationDimension[]
  ): number {
    if (dimensions.length === 0) return 0;

    const weightSum = dimensions.reduce((sum, d) => sum + d.weight, 0);
    if (weightSum === 0) return 0;

    const scoreByDim = new Map(dimensionScores.map((ds) => [ds.dimensionId, ds.score]));
    let total = 0;

    for (const dim of dimensions) {
      const score = scoreByDim.get(dim.id) ?? 0;
      total += score * (dim.weight / weightSum);
    }

    return Math.round(total * 100) / 100;
  }

  getLevelDescription(dimension: EvaluationDimension, score: number): string {
    if (score <= 1) return dimension.levelDescription1;
    if (score <= 3) return dimension.levelDescription3;
    return dimension.levelDescription5;
  }

  getRankBadge(finalScore: number, maxPossible: number = 5): 'critical' | 'high' | 'medium' | 'low' {
    const pct = maxPossible > 0 ? finalScore / maxPossible : 0;
    if (pct >= 0.8) return 'low';    // high score = low priority
    if (pct >= 0.6) return 'medium';
    if (pct >= 0.4) return 'high';
    return 'critical';
  }
}
