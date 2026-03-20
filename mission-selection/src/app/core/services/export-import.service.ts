import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
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

  async export(): Promise<void> {
    const data = this.storage.exportAll();
    const json = JSON.stringify(data, null, 2);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `mission-selection-backup-${date}.json`;

    if (Capacitor.getPlatform() !== 'web') {
      await this.exportNative(json, filename);
    } else {
      this.exportWeb(json, filename);
    }
  }

  private async exportNative(json: string, filename: string): Promise<void> {
    try {
      const { uri } = await Filesystem.writeFile({
        path: filename,
        data: json,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      await Share.share({
        title: filename,
        url: uri,
        dialogTitle: 'Save or share backup',
      });
    } catch {
      try {
        await Share.share({
          title: filename,
          text: json,
          dialogTitle: 'Save or share backup',
        });
      } catch {
        await Clipboard.write({ string: json });
        throw new Error(
          'Copied to clipboard. Paste into Files or Notes to save.'
        );
      }
    }
  }

  private exportWeb(json: string, filename: string): void {
    const blob = new Blob([json], { type: 'application/json' });
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
