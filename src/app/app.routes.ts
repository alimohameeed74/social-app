import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard.js';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout.component').then((c) => c.AuthLayoutComponent),
    loadChildren: () => import('./core/auth/auth.routes').then((f) => f.routes),
  },
  {
    path: 'main',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then((c) => c.MainLayoutComponent),
    loadChildren: () => import('./features/main.routes').then((f) => f.routes),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./core/layouts/components/not-found/not-found.component').then(
        (c) => c.NotFoundComponent,
      ),
    title: '404',
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
