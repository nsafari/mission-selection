import { Injectable, signal, computed } from '@angular/core';
import type { EvaluatedItem } from '../models/evaluated-item.model';
import { StorageService } from './storage.service';
import { CalculationService } from './calculation.service';
import { ScoringRulesService } from './scoring-rules.service';

@Injectable({ providedIn: 'root' })
export class EvaluatedItemsService {
  private itemsSignal = signal<EvaluatedItem[]>([]);

  items = this.itemsSignal.asReadonly();
  sortedByPriority = computed(() => {
    const list = [...this.itemsSignal()];
    return list.sort((a, b) => a.finalScore - b.finalScore); // lower = higher priority
  });

  constructor(
    private storage: StorageService,
    private calculation: CalculationService,
    private rules: ScoringRulesService
  ) {
    this.load();
  }

  load(): void {
    this.itemsSignal.set(this.storage.getEvaluatedItems());
  }

  add(item: Omit<EvaluatedItem, 'id' | 'createdAt'>): EvaluatedItem {
    const dimensions = this.rules.dimensions();
    const finalScore = this.calculation.calculateFinalScore(item.dimensionScores, dimensions);
    const newItem: EvaluatedItem = {
      ...item,
      id: crypto.randomUUID(),
      finalScore,
      createdAt: new Date(),
    };
    this.itemsSignal.update((list) => {
      const next = [...list, newItem];
      this.storage.setEvaluatedItems(next);
      return next;
    });
    return newItem;
  }

  remove(id: string): void {
    this.itemsSignal.update((list) => {
      const next = list.filter((i) => i.id !== id);
      this.storage.setEvaluatedItems(next);
      return next;
    });
  }
}
