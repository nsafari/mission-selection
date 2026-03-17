import { Component, signal, computed, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Send } from 'lucide-angular';
import type { EvaluationDimension } from '../../../core/models/evaluation-dimension.model';
import type { DimensionScore } from '../../../core/models/dimension-score.model';
import { ScoringRulesService } from '../../../core/services/scoring-rules.service';
import { EvaluatedItemsService } from '../../../core/services/evaluated-items.service';
import { CalculationService } from '../../../core/services/calculation.service';

@Component({
  selector: 'app-evaluate-form',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './evaluate-form.component.html',
  styleUrl: './evaluate-form.component.css',
})
export class EvaluateFormComponent {
  readonly Send = Send;

  private rules = inject(ScoringRulesService);
  private items = inject(EvaluatedItemsService);
  private calculation = inject(CalculationService);
  private router = inject(Router);

  topicTitle = signal('');
  dimensionScores = signal<Record<string, number>>({});
  dimensions = this.rules.dimensions;
  editingItem = this.items.editItem;

  liveDescription = computed(() => {
    const dims = this.dimensions();
    const scores = this.dimensionScores();
    return (dimId: string) => {
      const dim = dims.find((d) => d.id === dimId);
      if (!dim) return '';
      const score = scores[dimId] ?? 1;
      return this.calculation.getLevelDescription(dim, score);
    };
  });

  constructor() {
    effect(() => {
      const item = this.items.editItem();
      if (item) {
        this.topicTitle.set(item.topicTitle);
        const scores: Record<string, number> = {};
        for (const ds of item.dimensionScores) {
          scores[ds.dimensionId] = ds.score;
        }
        this.dimensionScores.set(scores);
      }
    });
  }

  getScore(dimId: string): number {
    return this.dimensionScores()[dimId] ?? 1;
  }

  setScore(dimId: string, score: number): void {
    this.dimensionScores.update((s) => ({ ...s, [dimId]: score }));
  }

  submit(): void {
    const title = this.topicTitle().trim();
    const dims = this.dimensions();
    if (!title || dims.length === 0) return;

    const scores: DimensionScore[] = dims.map((d) => ({
      dimensionId: d.id,
      score: this.getScore(d.id),
    }));

    const existing = this.items.editItem();
    if (existing) {
      this.items.update({ ...existing, topicTitle: title, dimensionScores: scores });
      this.items.clearEditItem();
    } else {
      this.items.add({ topicTitle: title, dimensionScores: scores });
    }
    this.router.navigate(['/dashboard']);
  }

  canSubmit(): boolean {
    return this.topicTitle().trim().length > 0 && this.dimensions().length > 0;
  }
}
