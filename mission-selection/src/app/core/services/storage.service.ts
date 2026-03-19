import { Injectable } from '@angular/core';
import type { EvaluationDimension } from '../models/evaluation-dimension.model';
import type { EvaluatedItem } from '../models/evaluated-item.model';
import type { MissionSelectionExport } from '../models/export-format.model';

const DIMENSIONS_KEY = 'mission-selection_dimensions';
const ITEMS_KEY = 'mission-selection_evaluated_items';
const EXPORT_VERSION = 1;

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
      return parsed
        .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
        .map((item) => ({
          ...item,
          createdAt: new Date(String(item['createdAt'] ?? 0)),
        })) as EvaluatedItem[];
    } catch {
      return [];
    }
  }

  setEvaluatedItems(items: EvaluatedItem[]): void {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  }

  exportAll(): MissionSelectionExport {
    return {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      dimensions: this.getDimensions(),
      evaluatedItems: this.getEvaluatedItems(),
    };
  }

  importAll(data: unknown): { success: boolean; error?: string } {
    const parsed = data as MissionSelectionExport | null;
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid file format' };
    }
    if (parsed.version !== EXPORT_VERSION) {
      return { success: false, error: 'Unsupported export version' };
    }
    const dims = parsed.dimensions;
    const items = parsed.evaluatedItems;
    if (!Array.isArray(dims) || !Array.isArray(items)) {
      return { success: false, error: 'Invalid file structure' };
    }
    const validDims = dims.filter(
      (d) =>
        d &&
        typeof d.id === 'string' &&
        typeof d.name === 'string' &&
        typeof d.weight === 'number'
    );
    const validItems = items
      .filter(
        (i) =>
          i &&
          typeof i.id === 'string' &&
          typeof i.topicTitle === 'string' &&
          Array.isArray(i.dimensionScores)
      )
      .map((i) => ({
        ...i,
        createdAt: new Date(String(i.createdAt ?? 0)),
      })) as EvaluatedItem[];
    this.setDimensions(validDims);
    this.setEvaluatedItems(validItems);
    return { success: true };
  }
}
