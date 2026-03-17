import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import { EvaluatedItemsService } from '../../core/services/evaluated-items.service';
import { CalculationService } from '../../core/services/calculation.service';

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

  constructor(
    private evaluatedItems: EvaluatedItemsService,
    private calculation: CalculationService,
    private router: Router
  ) {}

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
