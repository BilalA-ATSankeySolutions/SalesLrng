import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./components/dashboard/user-profile/user-profile.component')
          .then(m => m.UserProfileComponent)
      },
      {
        path: 'overview',
        loadComponent: () => import('./components/dashboard/overview/overview.component')
          .then(m => m.OverviewComponent)
      },
      {
        path: 'insights',
        loadComponent: () => import('./components/dashboard/insights.component')
          .then(m => m.InsightsComponent)
      },
      {
        path: 'analyse',
        loadComponent: () => import('./components/dashboard/analyse/analyse.component')
          .then(m => m.AnalyticsComponent)
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];