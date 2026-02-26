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
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((p) => p.RegisterComponent),
    title: 'Sign Up',
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./pages/forget-password/forget-password.component').then(
        (p) => p.ForgetPasswordComponent,
      ),
    title: 'Reset Password',
  },
];
