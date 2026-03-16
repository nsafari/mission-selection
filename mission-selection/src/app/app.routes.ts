import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'evaluate', loadComponent: () => import('./features/evaluate/evaluate-form/evaluate-form.component').then(m => m.EvaluateFormComponent) },
  { path: 'rules', loadComponent: () => import('./features/rules/rules-settings/rules-settings.component').then(m => m.RulesSettingsComponent) },
  { path: '**', redirectTo: '/dashboard' },
];
