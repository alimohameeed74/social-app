import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('../app/core/auth/pages/login/login.component').then((c) => c.LoginComponent),
    title: 'Login',
  },
  {
    path: '404',
    loadComponent: () =>
      import('../app/core/layouts/components/not-found/not-found.component').then(
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
