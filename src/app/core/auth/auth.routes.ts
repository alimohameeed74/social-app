import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((p) => p.LoginComponent),
    title: 'Sign In',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((p) => p.RegisterComponent),
    title: 'Sign Up',
  },
];
