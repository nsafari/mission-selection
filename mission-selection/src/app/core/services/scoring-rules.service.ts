import { Injectable, signal, computed } from '@angular/core';
import type { EvaluationDimension } from '../models/evaluation-dimension.model';
import { StorageService } from './storage.service';

const DEFAULT_DIMENSIONS: Omit<EvaluationDimension, 'id'>[] = [
  {
    name: 'Mission Alignment',
    weight: 0.25,
    levelDescription1: 'Little or no alignment with organizational mission',
    levelDescription3: 'Moderate alignment with some strategic overlap',
    levelDescription5: 'Strong alignment, directly advances core mission',
  },
  {
    name: 'Impact',
    weight: 0.2,
    levelDescription1: 'Minimal impact on target outcomes',
    levelDescription3: 'Moderate impact with measurable benefits',
    levelDescription5: 'High impact with transformational potential',
  },
  {
    name: 'Feasibility',
    weight: 0.2,
    levelDescription1: 'Not feasible with current constraints',
    levelDescription3: 'Achievable with moderate adjustments',
    levelDescription5: 'Highly feasible with available resources',
  },
  {
    name: 'Resource Requirements',
    weight: 0.15,
    levelDescription1: 'Excessive resource demands, unsustainable',
    levelDescription3: 'Manageable requirements, some trade-offs',
    levelDescription5: 'Lean requirements, efficient use of resources',
  },
  {
    name: 'Strategic Fit',
    weight: 0.1,
    levelDescription1: 'Conflict with strategic priorities',
    levelDescription3: 'Complements some strategic initiatives',
    levelDescription5: 'Integral to strategic roadmap',
  },
  {
    name: 'Sustainability',
    weight: 0.1,
    levelDescription1: 'Not sustainable long-term',
    levelDescription3: 'Sustainable with ongoing support',
    levelDescription5: 'Self-sustaining or generates lasting value',
  },
];

@Injectable({ providedIn: 'root' })
export class ScoringRulesService {
  private dimensionsSignal = signal<EvaluationDimension[]>([]);

  dimensions = this.dimensionsSignal.asReadonly();
  count = computed(() => this.dimensionsSignal().length);

  constructor(private storage: StorageService) {
    this.load();
  }

  load(): void {
    let dims = this.storage.getDimensions();
    if (dims.length === 0) {
      dims = DEFAULT_DIMENSIONS.map((d) => ({
        ...d,
        id: crypto.randomUUID(),
      }));
      this.storage.setDimensions(dims);
    }
    this.dimensionsSignal.set(dims);
  }

  add(dimension: EvaluationDimension): void {
    this.dimensionsSignal.update((list) => {
      const next = [...list, dimension];
      this.storage.setDimensions(next);
      return next;
    });
  }

  update(dimension: EvaluationDimension): void {
    this.dimensionsSignal.update((list) => {
      const next = list.map((d) => (d.id === dimension.id ? dimension : d));
      this.storage.setDimensions(next);
      return next;
    });
  }

  remove(id: string): void {
    this.dimensionsSignal.update((list) => {
      const next = list.filter((d) => d.id !== id);
      this.storage.setDimensions(next);
      return next;
    });
  }

  getById(id: string): EvaluationDimension | undefined {
    return this.dimensionsSignal().find((d) => d.id === id);
  }
}
