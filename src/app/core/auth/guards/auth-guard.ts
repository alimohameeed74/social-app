import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert/sweet-alert.service.js';

export const authGuard: CanActivateFn = (route, state) => {
  const lS = localStorage.getItem('token');
  const router = inject(Router);
  const swal = inject(SweetAlertService);
  if (lS) {
    return true;
  } else {
    swal.fireSwal('please sign in first', 'warning');
    router.navigate(['/auth']);
    return false;
  }
};
