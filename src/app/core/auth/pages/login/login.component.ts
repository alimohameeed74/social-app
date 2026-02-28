import { SweetAlertService } from './../../../services/sweet-alert/sweet-alert.service';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service.js';
import { LoaderComponent } from '../../../layouts/components/loader/loader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, RouterLink, LoaderComponent],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword: boolean;
  isloading: any;

  constructor(
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
    });
    this.hidePassword = true;
    this.isloading = signal(false);
  }
  Login() {
    if (this.loginForm.valid) {
      this.isloading.set(true);
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isloading.set(false);
          if (res?.data?.token) {
            localStorage.setItem('token', JSON.stringify(res?.data?.token));
            this.sweetAlertService.fireSwal(res?.message, 'success');
            this.router.navigate(['/main']);
          }
        },
        error: (err) => {
          this.isloading.set(false);
          this.sweetAlertService.fireSwal(err?.error?.message, 'error');
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
    this.hidePassword = true;
    this.isloading.set(false);
  }
  showPassword() {
    this.hidePassword = !this.hidePassword;
  }
  get getEmailController() {
    return this.loginForm.get('email');
  }
  get getPasswordController() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    this.ClearForm();
    const lS = localStorage.getItem('token');
    if (lS) {
      this.router.navigate(['/main']);
    }
  }
}
