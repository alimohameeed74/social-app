import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../../layouts/components/loader/loader.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  imports: [ReactiveFormsModule],
})
export class ForgetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  constructor() {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
    });
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
  }
  ngOnInit() {}
}
