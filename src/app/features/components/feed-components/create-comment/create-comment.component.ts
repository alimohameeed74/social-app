import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from '../../../services/comments/comments.service.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AuthService } from '../../../../core/auth/services/auth.service.js';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css'],
  imports: [PickerComponent, ReactiveFormsModule],
})
export class CreateCommentComponent implements OnInit, OnChanges, OnDestroy {
  commentForm: FormGroup;
  selectedImgObj: WritableSignal<File | null> = signal(null);
  showEmojes: WritableSignal<boolean> = signal(false);
  imgSrc: WritableSignal<string | ArrayBuffer | null> = signal(null);
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);
  postId: InputSignal<string> = input.required();
  commentCreated = output<string>();
  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
  ) {
    this.commentForm = this.fb.group(
      {
        content: [''],
      },
      {
        validators: [this.checkContent],
      },
    );
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {}

  get userData() {
    return this.authService.getUserData();
  }
  checkContent(form: AbstractControl) {
    const content = form.get('content');

    if (content?.value.length < 2) {
      content?.setErrors({
        errLength: true,
      });
      return {
        contentLength: true,
      };
    }
    return null;
  }
  createFormData() {
    const formData = new FormData();
    if (this.commentForm.get('content')?.value) {
      formData.append('content', this.commentForm.get('content')?.value);
    }
    if (this.selectedImgObj()) {
      formData.append('image', this.selectedImgObj()!);
    }
    return formData;
  }
  createComment() {
    this.isLoading.set(true);
    this.commentsService
      .createcomment(this.createFormData(), this.postId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.sweetAlertService.fireSwal(res?.message, 'success');
          this.commentCreated.emit('created');
          this.clearForm();
        },
        error: (err) => {
          this.isLoading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal('failed to create comment', 'error');
          }
        },
      });
  }
  clearForm() {
    this.commentForm.reset({
      content: '',
    });
    this.selectedImgObj.set(null);
    this.imgSrc.set(null);
  }
  get getPostContentController() {
    return this.commentForm.get('content');
  }

  uploadImg(event: any) {
    this.selectedImgObj.set(event?.target?.files[0]);
    if (this.selectedImgObj()) {
      this.imgSrc.set(URL.createObjectURL(this.selectedImgObj()!));
    }

    event.target.value = null;
  }

  removeUploadedImg() {
    this.imgSrc.set(null);
    this.selectedImgObj.set(null);
  }
  toggleEmojes() {
    this.showEmojes.update((s) => !s);
  }
  writeEmoji(event: any) {
    const emoji = this.commentForm.get('content')?.value + event.emoji.native;
    this.commentForm.get('content')?.setValue(emoji);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
