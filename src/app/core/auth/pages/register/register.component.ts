import { SweetAlertService } from './../../../services/sweet-alert/sweet-alert.service';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service.js';
import { LoaderComponent } from '../../../layouts/components/loader/loader.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  maxDate: WritableSignal<string> = signal('');
  hidePassword: WritableSignal<boolean> = signal(true);
  isloading: WritableSignal<boolean> = signal(false);
  hideConfirmPassword: WritableSignal<boolean> = signal(true);
  registerForm: FormGroup;
  constructor(
    private authService: AuthService,
    private SweetAlertService: SweetAlertService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    const today = new Date();
    this.maxDate.set(today.toISOString().split('T')[0]);
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: [today.toISOString().split('T')[0], Validators.required],
        gender: ['male'],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
          ],
        ],
        rePassword: [''],
      },
      {
        validators: [this.checkPasswords],
      },
    );
  }
  createAccount() {
    if (this.registerForm.valid) {
      this.isloading.set(true);
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.isloading.set(false);
          if (res?.data?.token) {
            localStorage.setItem('token', res?.data?.token);
            localStorage.setItem('userData', JSON.stringify(res?.data?.user));
            this.authService.holdUserData(res?.data?.user);
            this.SweetAlertService.fireSwal('user created successfully.', 'success');
            this.router.navigate(['/main/feed']);
          }
        },
        error: (err) => {
          this.isloading.set(false);
          this.SweetAlertService.fireSwal(err?.error?.message, 'error');
          if (!navigator.onLine) {
            this.SweetAlertService.fireSwal('No Internet', 'error');
          } else if (err?.statusCode === 409) {
            this.router.navigate(['/auth']);
            this.SweetAlertService.fireSwal(err?.message, 'error');
          } else {
            this.SweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
    }
  }
  ClearForm() {
    const today = new Date();
    this.registerForm.reset({
      name: '',
      username: '',
      email: '',
      dateOfBirth: today.toISOString().split('T')[0],
      gender: 'male',
      password: '',
      rePassword: '',
    });
    this.hidePassword.set(true);
    this.hideConfirmPassword.set(true);
    this.isloading.set(false);
  }
  showPassword() {
    this.hidePassword.update((s) => !s);
  }
  showConfirmPassword() {
    this.hideConfirmPassword.update((s) => !s);
  }
  ngOnInit() {
    this.ClearForm();
  }
  get getNameController() {
    return this.registerForm.get('name');
  }
  get getUserNameController() {
    return this.registerForm.get('username');
  }
  get getEmailController() {
    return this.registerForm.get('email');
  }
  get getPasswordController() {
    return this.registerForm.get('password');
  }
  get getRePasswordController() {
    return this.registerForm.get('rePassword');
  }

  checkPasswords(registerForm: AbstractControl) {
    const password = registerForm.get('password');
    const rePassword = registerForm.get('rePassword');

    if (rePassword?.value !== password?.value) {
      rePassword?.setErrors({
        mismatch: true,
        password: password?.value,
        repassword: rePassword?.value,
      });
      return {
        mismatch: true,
        password: password?.value,
        repassword: rePassword?.value,
      };
    }

    return null;
  }
}
