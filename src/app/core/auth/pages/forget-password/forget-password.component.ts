import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  imports: [ReactiveFormsModule],
})
export class ForgetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  hidePassword: boolean;
  hideNewPassword: boolean;
  constructor() {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
    });
    this.hidePassword = true;
    this.hideNewPassword = true;
  }
  resetPassword() {
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
  }
  ngOnInit() {}

  showPassword() {
    this.hidePassword = !this.hidePassword;
  }
  showNewPassword() {
    this.hideNewPassword = !this.hideNewPassword;
  }
}
