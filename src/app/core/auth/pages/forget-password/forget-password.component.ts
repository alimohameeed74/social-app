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
  resetPassword() {
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
