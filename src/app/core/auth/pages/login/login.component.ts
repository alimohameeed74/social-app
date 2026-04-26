import { SweetAlertService } from './../../../services/sweet-alert/sweet-alert.service';
import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword: WritableSignal<boolean> = signal(true);
  isloading: WritableSignal<boolean> = signal(false);

  constructor(
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
    });
  }
  Login() {
    if (this.loginForm.valid) {
      this.isloading.set(true);
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isloading.set(false);
          if (res?.data?.token) {
            localStorage.setItem('token', res?.data?.token);
            localStorage.setItem('userData', JSON.stringify(res?.data?.user));
            this.authService.holdUserData(res?.data?.user);
            this.sweetAlertService.fireSwal(res?.message, 'success');
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
  ClearForm() {
    const today = new Date();
    this.loginForm.reset({
      email: '',
      password: '',
    });
    this.hidePassword.set(true);
    this.isloading.set(false);
  }
  showPassword() {
    this.hidePassword.update((s) => !s);
  }
  get getEmailController() {
    return this.loginForm.get('email');
  }
  get getPasswordController() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    this.ClearForm();
  }
}
