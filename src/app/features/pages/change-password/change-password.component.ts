import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component.js';
import { SweetAlertService } from '../../../core/services/sweet-alert/sweet-alert.service.js';
import { AuthService } from '../../../core/auth/services/auth.service.js';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [ReactiveFormsModule, LoaderComponent],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  hidePassword: boolean;
  hideNewPassword: boolean;
  isloading: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private sweetAlertService: SweetAlertService,
  ) {
    this.isloading = signal(false);
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
    });
    this.hidePassword = true;
    this.hideNewPassword = true;
  }
  changePassword() {
    // if (this.changePasswordForm.valid) {
    //   this.isloading.set(true);
    //   this.authService.resetPassword(this.changePasswordForm.value).subscribe({
    //     next: (res: any) => {
    //       console.log(res);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   });
    // }
    // this.isloading.set(false);
    // console.log(this.changePasswordForm.value);
    // this.clearForm();
  }
  clearForm() {
    this.changePasswordForm.reset({
      password: '',
      newPassword: '',
    });
    this.hidePassword = true;
    this.hideNewPassword = true;
    this.isloading.set(false);
  }
  ngOnInit() {
    this.clearForm();
    const lS = localStorage.getItem('token');
    console.log(lS);
    if (!lS) {
      this.sweetAlertService.fireSwal('please sign in first', 'warning');
      this.router.navigate(['/auth']);
    }
  }

  showPassword() {
    this.hidePassword = !this.hidePassword;
  }
  showNewPassword() {
    this.hideNewPassword = !this.hideNewPassword;
  }
  get getPasswordController() {
    return this.changePasswordForm.get('password');
  }
  get getNewPasswordController() {
    return this.changePasswordForm.get('newPassword');
  }
}
