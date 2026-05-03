import {
  Component,
  OnDestroy,
  OnInit,
  output,
  signal,
  WritableSignal,
  InputSignal,
  input,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { Iuser } from '../../../models/users/Iuser.js';
import { CommentsService } from '../../../services/comments/comments.service.js';

@Component({
  selector: 'app-create-reply',
  templateUrl: './create-reply.component.html',
  styleUrls: ['./create-reply.component.css'],
  imports: [PickerComponent, ReactiveFormsModule],
})
export class CreateReplyComponent implements OnInit, OnDestroy {
  replyCreated = output<string>();
  counter: WritableSignal<number> = signal(0);
  userDetails: WritableSignal<Iuser | null> = signal(null);
  showEmojes: WritableSignal<boolean> = signal(false);
  replyForm: FormGroup;
  selectedImgObj: WritableSignal<File | null> = signal(null);
  isloading: WritableSignal<boolean> = signal(false);
  imgSrc: WritableSignal<string | ArrayBuffer | null> = signal(null);
  commentId: InputSignal<string> = input.required();
  postId: InputSignal<string> = input.required();
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private commentService: CommentsService,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
  ) {
    this.replyForm = this.fb.group(
      {
        content: [''],
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
  createReply() {
    this.showEmojes.set(false);
    this.isloading.set(true);

    this.commentService
      .createReplyOnComment(this.postId(), this.commentId(), this.createFormData())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isloading.set(false);
          this.sweetAlertService.fireSwal(res?.message, 'success');
          this.counter.update((s) => s + 1);
          this.replyCreated.emit(`reply created ${this.counter()}`);
          this.clearForm();
        },
        error: (err) => {
          this.isloading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal('failed to create reply', 'error');
          }
        },
      });
  }
  get getPostBodyController() {
    return this.replyForm.get('content');
  }

  writeEmoji(event: any) {
    const emoji = this.replyForm.get('content')?.value + event.emoji.native;
    this.replyForm.get('content')?.setValue(emoji);
  }
  clearForm() {
    this.replyForm.reset({
      content: '',
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
    if (this.replyForm.get('content')?.value) {
      formData.append('content', this.replyForm.get('content')?.value);
    }
    if (this.selectedImgObj()) {
      formData.append('image', this.selectedImgObj()!);
    }
    return formData;
  }

  checkBody(form: AbstractControl) {
    const body = form.get('content');

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
