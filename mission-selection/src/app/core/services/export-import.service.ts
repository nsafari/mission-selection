import { Injectable } from '@angular/core';
import type { MissionSelectionExport } from '../models/export-format.model';
import { StorageService } from './storage.service';
import { ScoringRulesService } from './scoring-rules.service';
import { EvaluatedItemsService } from './evaluated-items.service';

@Injectable({ providedIn: 'root' })
export class ExportImportService {
  constructor(
    private storage: StorageService,
    private rules: ScoringRulesService,
    private items: EvaluatedItemsService
  ) {}

  export(): void {
    const data = this.storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const date = new Date().toISOString().slice(0, 10);
    const filename = `mission-selection-backup-${date}.json`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromFile(file: File): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string) as unknown;
          const result = this.storage.importAll(parsed);
          if (result.success) {
            this.rules.load();
            this.items.load();
          }
          resolve(result);
        } catch {
          resolve({ success: false, error: 'Failed to parse file' });
        }
      };
      reader.onerror = () =>
        resolve({ success: false, error: 'Failed to read file' });
      reader.readAsText(file);
    });
  }
}
