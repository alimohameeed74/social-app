import { AuthService } from './../../../../core/auth/services/auth.service';
import { Component, OnDestroy, OnInit, output, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostsService } from '../../../services/posts/posts.service.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { Iuser } from '../../../models/users/Iuser.js';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  imports: [PickerComponent, ReactiveFormsModule],
})
export class CreatePostComponent implements OnInit, OnDestroy {
  postCreated = output<string>();
  counter: WritableSignal<number> = signal(0);
  userDetails: WritableSignal<Iuser | null> = signal(null);
  showEmojes: WritableSignal<boolean> = signal(false);
  postForm: FormGroup;
  selectedImgObj: WritableSignal<File | null> = signal(null);
  isloading: WritableSignal<boolean> = signal(false);
  imgSrc: WritableSignal<string | ArrayBuffer | null> = signal(null);
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
  ) {
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
    this.userDetails.set(this.userData);
    this.clearForm();
  }

  get userData() {
    return this.authService.getUserData();
  }

  toggleEmojes() {
    this.showEmojes.update((s) => !s);
  }
  createPost() {
    this.showEmojes.set(false);
    this.isloading.set(true);

    this.postsService
      .createPost(this.createFormData())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isloading.set(false);
          this.sweetAlertService.fireSwal(res?.message, 'success');
          this.counter.update((s) => s + 1);
          this.postCreated.emit(`post created ${this.counter()}`);
          this.clearForm();
        },
        error: (err) => {
          this.isloading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal('failed to create post', 'error');
          }
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
    this.selectedImgObj.set(null);
    this.imgSrc.set(null);
  }

  uploadImg(event: any) {
    this.selectedImgObj.set(event?.target?.files[0]);
    if (this.selectedImgObj()) {
      this.imgSrc.set(URL.createObjectURL(this.selectedImgObj()!));
    }
  }
  createFormData() {
    const formData = new FormData();
    if (this.postForm.get('body')?.value) {
      formData.append('body', this.postForm.get('body')?.value);
    }
    if (this.selectedImgObj()) {
      formData.append('image', this.selectedImgObj()!);
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
    this.imgSrc.set(null);
    this.selectedImgObj.set(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
