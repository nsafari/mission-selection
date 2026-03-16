import { Injectable, signal, computed } from '@angular/core';
import type { EvaluationDimension } from '../models/evaluation-dimension.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ScoringRulesService {
  private dimensionsSignal = signal<EvaluationDimension[]>([]);

  dimensions = this.dimensionsSignal.asReadonly();
  count = computed(() => this.dimensionsSignal().length);

  constructor(private storage: StorageService) {
    this.load();
  }

  load(): void {
    this.dimensionsSignal.set(this.storage.getDimensions());
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
