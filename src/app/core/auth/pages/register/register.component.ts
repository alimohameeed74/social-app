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
  registerForm: FormGroup;
  constructor() {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl(today.toISOString().split('T')[0], Validators.required),
      gender: new FormControl('male', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    });
  }
  createAccount() {
    console.log(this.registerForm.value);
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
  }
  ngOnInit() {}
}
