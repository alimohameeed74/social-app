import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { SweetAlertService } from '../../../core/services/sweet-alert/sweet-alert.service.js';
import { AuthService } from '../../../core/auth/services/auth.service.js';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [ReactiveFormsModule],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  hidePassword: WritableSignal<boolean> = signal(true);
  hideNewPassword: WritableSignal<boolean> = signal(true);
  isloading: WritableSignal<boolean> = signal(false);
  constructor(
    private authService: AuthService,
    private router: Router,
    private sweetAlertService: SweetAlertService,
    private fb: FormBuilder,
  ) {
    this.changePasswordForm = this.fb.group(
      {
        password: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
          ],
        ],
      },
      {
        validators: [this.checkEqualPasswords],
      },
    );
  }
  changePassword() {
    if (this.changePasswordForm.valid) {
      this.isloading.set(true);
      this.authService.resetPassword(this.changePasswordForm.value).subscribe({
        next: (res: any) => {
          this.isloading.set(false);
          if (res?.data?.token) {
            localStorage.setItem('token', res?.data?.token);
            this.sweetAlertService.fireSwal(res?.message, 'success');
            this.clearForm();
            this.router.navigate(['/main']);
          }
        },
        error: (err) => {
          this.isloading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
    }
  }
  clearForm() {
    this.changePasswordForm.reset({
      password: '',
      newPassword: '',
    });
    this.hidePassword.set(true);
    this.hideNewPassword.set(true);
    this.isloading.set(false);
  }
  ngOnInit() {
    this.clearForm();
  }

  showPassword() {
    this.hidePassword.update((s) => !s);
  }
  showNewPassword() {
    this.hideNewPassword.update((s) => !s);
  }
  get getPasswordController() {
    return this.changePasswordForm.get('password');
  }
  get getNewPasswordController() {
    return this.changePasswordForm.get('newPassword');
  }

  checkEqualPasswords(form: AbstractControl) {
    const password = form.get('password')?.value;
    const newPassword = form.get('newPassword')?.value;

    if (password === newPassword) {
      return {
        match: true,
      };
    } else {
      return null;
    }
  }
}
