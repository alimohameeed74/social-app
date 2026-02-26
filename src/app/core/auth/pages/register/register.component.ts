import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  maxDate: string = '';
  hidePassword: boolean;
  hideConfirmPassword: boolean;
  registerForm: FormGroup;
  constructor() {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl(today.toISOString().split('T')[0], Validators.required),
      gender: new FormControl('male'),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    });
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }
  createAccount() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
    this.ClearForm();
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
}
