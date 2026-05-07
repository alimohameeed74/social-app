import {
  Component,
  effect,
  input,
  InputSignal,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Iuser } from '../../../models/users/Iuser.js';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../../services/posts/posts.service.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { Ipost } from '../../../models/posts/Ipost.js';

@Component({
  selector: 'app-edit-post-comment',
  templateUrl: './edit-post-comment.component.html',
  styleUrls: ['./edit-post-comment.component.css'],
  imports: [PickerComponent, ReactiveFormsModule],
})
export class EditPostCommentComponent implements OnInit, OnChanges, OnDestroy {
  postData: InputSignal<{ id: string; privacy: string; body: string; image: string }> =
    input.required();
  closeModalEvent = output<string>();
  private destroy$ = new Subject<void>();
  postUpdated = output<Ipost>();
  counter: WritableSignal<number> = signal(0);
  userDetails: WritableSignal<Iuser | null> = signal(null);
  showEmojes: WritableSignal<boolean> = signal(false);
  postForm: FormGroup;
  selectedImgObj: WritableSignal<File | null> = signal(null);
  isloading: WritableSignal<boolean> = signal(false);
  imgSrc: WritableSignal<string | ArrayBuffer | null> = signal(null);
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

    effect(() => {
      this.postForm.patchValue({
        privacy: this.postData().privacy,
        body: this.postData().body,
      });
      this.imgSrc.set(this.postData().image);
    });
  }

  ngOnInit() {
    this.userDetails.set(this.userData);
    this.clearForm();
  }

  ngOnChanges(): void {}

  get userData() {
    return this.authService.getUserData();
  }

  toggleEmojes() {
    this.showEmojes.update((s) => !s);
  }
  updatePost() {
    this.showEmojes.set(false);
    this.isloading.set(true);

    this.postsService
      .updatePost(this.postData().id, this.createFormData())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { post: Ipost; message: string }) => {
          this.isloading.set(false);
          this.sweetAlertService.fireSwal(res?.message, 'success');
          this.postUpdated.emit(res.post);
          this.clearForm();
        },
        error: (err) => {
          this.isloading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal('failed to update post', 'error');
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

    event.target.value = null;
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

  closeModal() {
    this.clearForm();
    this.destroy$.next();
    this.closeModalEvent.emit('close edit modal');
  }
}
