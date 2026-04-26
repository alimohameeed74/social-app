import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert/sweet-alert.service.js';
import { AuthService } from '../services/auth.service.js';

export const authGuard: CanActivateFn = (route, state) => {
  const lS = localStorage.getItem('token');
  const router = inject(Router);
  const swal = inject(SweetAlertService);
  const auth = inject(AuthService);
  if (lS && !auth.isTokenExpired(lS) && auth.isUserLoggedIn()) {
    return true;
  } else {
    auth.deleteUserData();
    auth.userLogout();
    swal.fireSwal('please sign in first', 'warning');
    router.navigate(['/auth']);
    return false;
  }
};
