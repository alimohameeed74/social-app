import { SweetAlertService } from './../../../services/sweet-alert/sweet-alert.service';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../../layouts/components/loader/loader.component';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  imports: [ReactiveFormsModule, LoaderComponent],
})
export class ForgetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  hidePassword: boolean;
  hideNewPassword: boolean;
  isloading: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private sweetAlertService: SweetAlertService,
  ) {
    this.isloading = signal(false);
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
    });
    this.hidePassword = true;
    this.hideNewPassword = true;
  }
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.isloading.set(true);
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
    this.isloading.set(false);
    console.log(this.resetPasswordForm.value);
    this.clearForm();
  }
  clearForm() {
    this.resetPasswordForm.reset({
      password: '',
      newPassword: '',
    });
    this.hidePassword = true;
    this.hideNewPassword = true;
    this.isloading.set(false);
  }
  ngOnInit() {
    this.clearForm();
  }

  showPassword() {
    this.hidePassword = !this.hidePassword;
  }
  showNewPassword() {
    this.hideNewPassword = !this.hideNewPassword;
  }
  get getPasswordController() {
    return this.resetPasswordForm.get('password');
  }
  get getNewPasswordController() {
    return this.resetPasswordForm.get('newPassword');
  }
}
