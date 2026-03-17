export interface EvaluationDimension {
  id: string;
  name: string;
  weight: number; // 0-1, represents relative importance
  levelDescription1: string;
  levelDescription3: string;
  levelDescription5: string;
}
