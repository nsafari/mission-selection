import type { EvaluationDimension } from './evaluation-dimension.model';
import type { EvaluatedItem } from './evaluated-item.model';

export interface MissionSelectionExport {
  version: number;
  exportedAt: string;
  dimensions: EvaluationDimension[];
  evaluatedItems: EvaluatedItem[];
}
