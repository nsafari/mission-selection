import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutDashboard, PlusCircle, Settings } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { EvaluatedItemsService } from '../../core/services/evaluated-items.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly LayoutDashboard = LayoutDashboard;
  readonly PlusCircle = PlusCircle;
  readonly Settings = Settings;

  constructor(private items: EvaluatedItemsService) {}

  goToNewEval(): void {
    this.items.clearEditItem();
  }

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: this.LayoutDashboard },
    { path: '/evaluate', label: 'New Eval', icon: this.PlusCircle },
    { path: '/rules', label: 'Rules', icon: this.Settings },
  ];
}
