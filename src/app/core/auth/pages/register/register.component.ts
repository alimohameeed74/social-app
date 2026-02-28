import { SweetAlertService } from './../../../services/sweet-alert/sweet-alert.service';
import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
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
  imports: [ReactiveFormsModule, LoaderComponent],
})
export class RegisterComponent implements OnInit {
  maxDate: string = '';
  hidePassword: boolean;
  isloading: any;
  hideConfirmPassword: boolean;
  registerForm: FormGroup;
  constructor(
    private authService: AuthService,
    private SweetAlertService: SweetAlertService,
    private router: Router,
  ) {
    this.isloading = signal(false);
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        dateOfBirth: new FormControl(today.toISOString().split('T')[0], Validators.required),
        gender: new FormControl('male'),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ]),
        rePassword: new FormControl(''),
      },
      {
        validators: [this.checkPasswords],
      },
    );
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }
  createAccount() {
    if (this.registerForm.valid) {
      this.isloading.set(true);
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.isloading.set(false);
          if (res?.data?.token) {
            localStorage.setItem('token', JSON.stringify(res?.data?.token));
            this.SweetAlertService.fireSwal('user created successfully.', 'success');
            this.router.navigate(['/main/feed']);
          }
        },
        error: (err) => {
          this.isloading.set(false);
          this.SweetAlertService.fireSwal(err?.error?.message, 'error');
          if (err.status === 409) {
            this.router.navigate(['/auth']);
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
    this.hidePassword = true;
    this.hideConfirmPassword = true;
    this.isloading.set(false);
  }
  showPassword() {
    this.hidePassword = !this.hidePassword;
  }
  showConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
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
