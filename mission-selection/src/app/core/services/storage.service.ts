import { Injectable } from '@angular/core';
import type { EvaluationDimension } from '../models/evaluation-dimension.model';
import type { EvaluatedItem } from '../models/evaluated-item.model';

const DIMENSIONS_KEY = 'mission-selection_dimensions';
const ITEMS_KEY = 'mission-selection_evaluated_items';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getDimensions(): EvaluationDimension[] {
    const raw = localStorage.getItem(DIMENSIONS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  setDimensions(dimensions: EvaluationDimension[]): void {
    localStorage.setItem(DIMENSIONS_KEY, JSON.stringify(dimensions));
  }

  getEvaluatedItems(): EvaluatedItem[] {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as unknown[];
      return parsed.map((item) => ({
        ...item,
        createdAt: new Date((item as EvaluatedItem & { createdAt: string }).createdAt),
      })) as EvaluatedItem[];
    } catch {
      return [];
    }
  }

  setEvaluatedItems(items: EvaluatedItem[]): void {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  }
}
