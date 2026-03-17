import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2, Pencil } from 'lucide-angular';
import type { EvaluationDimension } from '../../../core/models/evaluation-dimension.model';
import { ScoringRulesService } from '../../../core/services/scoring-rules.service';

@Component({
  selector: 'app-rules-settings',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './rules-settings.component.html',
  styleUrl: './rules-settings.component.css',
})
export class RulesSettingsComponent {
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Pencil = Pencil;

  private rules = inject(ScoringRulesService);
  dimensions = this.rules.dimensions;
  editingId = signal<string | null>(null);
  showForm = signal(false);

  formModel = signal<Partial<EvaluationDimension>>({
    name: '',
    weight: 0.2,
    levelDescription1: '',
    levelDescription3: '',
    levelDescription5: '',
  });

  openAdd(): void {
    this.editingId.set(null);
    this.formModel.set({
      name: '',
      weight: 0.2,
      levelDescription1: '',
      levelDescription3: '',
      levelDescription5: '',
    });
    this.showForm.set(true);
  }

  openEdit(d: EvaluationDimension): void {
    this.editingId.set(d.id);
    this.formModel.set({ ...d });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  save(): boolean {
    const model = this.formModel();
    if (!model.name?.trim()) {
      return false;
    }

    const payload: EvaluationDimension = {
      id: this.editingId() ?? crypto.randomUUID(),
      name: model.name.trim(),
      weight: Math.max(0, Math.min(1, model.weight ?? 0)),
      levelDescription1: (model.levelDescription1 ?? '').trim(),
      levelDescription3: (model.levelDescription3 ?? '').trim(),
      levelDescription5: (model.levelDescription5 ?? '').trim(),
    };

    if (this.editingId()) {
      this.rules.update(payload);
    } else {
      this.rules.add(payload);
    }
    this.cancelForm();
    return true;
  }

  remove(id: string): void {
    if (confirm('Remove this dimension?')) {
      this.rules.remove(id);
    }
  }

  updateForm<K extends keyof EvaluationDimension>(key: K, value: EvaluationDimension[K]): void {
    this.formModel.update((m) => ({ ...m, [key]: value }));
  }
}
