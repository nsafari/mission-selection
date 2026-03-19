import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EvaluateFormComponent } from './features/evaluate/evaluate-form/evaluate-form.component';
import { RulesSettingsComponent } from './features/rules/rules-settings/rules-settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'evaluate', component: EvaluateFormComponent },
  { path: 'rules', component: RulesSettingsComponent },
  { path: '**', redirectTo: '/dashboard' },
];
