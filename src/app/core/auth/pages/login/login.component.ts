import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword: boolean;
  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
    });
    this.hidePassword = true;
  }
  Login() {
    console.log(this.loginForm.value);
    this.ClearForm();
  }
  ClearForm() {
    const today = new Date();
    this.loginForm.reset({
      email: '',
      password: '',
    });
    this.hidePassword = true;
  }
  showPassword() {
    this.hidePassword = !this.hidePassword;
  }

  ngOnInit() {}
}
