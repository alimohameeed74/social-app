import { Comment } from './../../../models/comments/Ilike-comment-response';
import {
  Component,
  effect,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentsService } from '../../../services/comments/comments.service.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { Subject, takeUntil } from 'rxjs';
import { Icomment } from '../../../models/comments/Icomment.js';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css'],
  imports: [PickerComponent, ReactiveFormsModule],
})
export class EditCommentComponent implements OnInit, OnChanges {
  commentData: InputSignal<{ commentId: string; postId: string; content: string; image: string }> =
    input.required();
  commentForm: FormGroup;
  selectedImgObj: WritableSignal<File | null> = signal(null);
  showEmojes: WritableSignal<boolean> = signal(false);
  imgSrc: WritableSignal<string | ArrayBuffer | null> = signal(null);
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);

  commentUpdated = output<Icomment>();
  closeModalEvent = output<string>();
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

    effect(() => {
      this.commentForm.patchValue({
        content: this.commentData().content,
      });
      this.imgSrc.set(this.commentData().image);
    });
  }

  ngOnInit() {}
  ngOnChanges(): void {}

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
  updateComment() {
    this.isLoading.set(true);
    this.commentsService
      .editComment(this.commentData().postId, this.commentData().commentId, this.createFormData())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { comment: Icomment; message: string }) => {
          this.isLoading.set(false);
          this.sweetAlertService.fireSwal(res.message, 'success');
          this.commentUpdated.emit(res.comment);
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

  closeModal() {
    this.clearForm();
    this.destroy$.next();
    this.closeModalEvent.emit('close edit modal');
  }
}
