import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2, Download, Upload } from 'lucide-angular';
import { EvaluatedItemsService } from '../../core/services/evaluated-items.service';
import { CalculationService } from '../../core/services/calculation.service';
import { ExportImportService } from '../../core/services/export-import.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Download = Download;
  readonly Upload = Upload;

  importError = '';
  isImporting = false;

  constructor(
    private evaluatedItems: EvaluatedItemsService,
    private calculation: CalculationService,
    private router: Router,
    private exportImport: ExportImportService
  ) {}

  exportData(): void {
    this.exportImport.export();
  }

  onImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (
      !confirm(
        'This will replace all rules and topics with the imported data. Continue?'
      )
    ) {
      input.value = '';
      return;
    }
    this.importError = '';
    this.isImporting = true;
    this.exportImport.importFromFile(file).then((result) => {
      this.isImporting = false;
      input.value = '';
      if (result.success) {
        this.importError = '';
      } else {
        this.importError = result.error ?? 'Import failed';
      }
    });
  }

  triggerImport(): void {
    document.getElementById('import-file-input')?.click();
  }

  get items() {
    return this.evaluatedItems.sortedByPriority;
  }

  getRankBadge(score: number): 'critical' | 'high' | 'medium' | 'low' {
    return this.calculation.getRankBadge(score, 5);
  }

  getRankLabel(rank: 'critical' | 'high' | 'medium' | 'low'): string {
    return rank.charAt(0).toUpperCase() + rank.slice(1);
  }

  edit(item: { id: string; topicTitle: string; dimensionScores: { dimensionId: string; score: number }[]; finalScore: number; createdAt: Date }): void {
    this.evaluatedItems.setEditItem(item);
    this.router.navigate(['/evaluate']);
  }

  remove(id: string): void {
    if (confirm('Delete this evaluation?')) {
      this.evaluatedItems.remove(id);
    }
  }
}
