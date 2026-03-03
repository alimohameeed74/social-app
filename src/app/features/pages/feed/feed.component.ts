import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostsService } from '../../services/posts/posts.service.js';
import { SweetAlertService } from '../../../core/services/sweet-alert/sweet-alert.service.js';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  imports: [PickerComponent, ReactiveFormsModule, LoaderComponent],
})
export class FeedComponent implements OnInit {
  showEmojes: boolean;
  postForm: FormGroup;
  selectedImgObj: File | null;
  isloading: any;
  imgSrc: string | ArrayBuffer | null;
  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
  ) {
    this.isloading = signal(false);
    this.selectedImgObj = null;
    this.showEmojes = false;
    this.imgSrc = null;
    this.postForm = this.fb.group(
      {
        privacy: ['public'],
        body: [''],
      },
      {
        validators: [this.checkBody],
      },
    );
  }

  ngOnInit() {
    this.clearForm();
  }
  toggleEmojes() {
    this.showEmojes = !this.showEmojes;
  }
  createPost() {
    this.showEmojes = false;
    this.isloading.set(true);

    this.postsService.createPost(this.createFormData()).subscribe({
      next: (res) => {
        this.isloading.set(false);
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.clearForm();
      },
      error: (err) => {
        this.isloading.set(false);
        this.sweetAlertService.fireSwal('failed to create post', 'error');
      },
    });
  }
  get getPostBodyController() {
    return this.postForm.get('body');
  }

  writeEmoji(event: any) {
    const emoji = this.postForm.get('body')?.value + event.emoji.native;
    this.postForm.get('body')?.setValue(emoji);
  }
  clearForm() {
    this.postForm.reset({
      privacy: 'public',
      body: '',
    });
    this.selectedImgObj = null;
    this.imgSrc = null;
  }

  uploadImg(event: any) {
    this.selectedImgObj = event?.target?.files[0];
    if (this.selectedImgObj) {
      this.imgSrc = URL.createObjectURL(this.selectedImgObj);
    }
  }
  createFormData() {
    const formData = new FormData();
    if (this.postForm.get('body')?.value) {
      formData.append('body', this.postForm.get('body')?.value);
    }
    if (this.selectedImgObj) {
      formData.append('image', this.selectedImgObj);
    }
    formData.append('privacy', this.postForm.get('privacy')?.value);
    return formData;
  }

  checkBody(form: AbstractControl) {
    const body = form.get('body');

    if (body?.value.length < 2) {
      body?.setErrors({
        errLength: true,
      });
      return {
        bodyLength: true,
      };
    }
    return null;
  }

  removeUploadedImg() {
    this.imgSrc = null;
    this.selectedImgObj = null;
  }
}
