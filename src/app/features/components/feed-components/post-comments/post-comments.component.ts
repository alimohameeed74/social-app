import { CommentsService } from './../../../services/comments/comments.service';
import { Component, OnInit, signal } from '@angular/core';
import { PostsService } from '../../../services/posts/posts.service.js';
import { Icomment } from '../../../models/comments/Icomment.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { ActivatedRoute } from '@angular/router';
import { TimeService } from '../../../../core/services/time/time.service.js';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { LoaderComponent } from '../../../../core/layouts/components/loader/loader.component';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css'],
  imports: [ContentLoaderComponent, ReactiveFormsModule, PickerComponent, LoaderComponent],
})
export class PostCommentsComponent implements OnInit {
  comments = signal<Icomment[]>([]);
  commentsLoading = signal<boolean>(false);
  commentForm: FormGroup;
  isLoading = signal<boolean>(false);
  postId: string = '';
  selectedImgObj: File | null;
  showEmojes: boolean;
  imgSrc: string | ArrayBuffer | null;
  constructor(
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
    private activatedRoute: ActivatedRoute,
    private timeService: TimeService,
    private fb: FormBuilder,
    private commentsService: CommentsService,
  ) {
    this.selectedImgObj = null;
    this.showEmojes = false;
    this.imgSrc = null;
    this.commentForm = this.fb.group(
      {
        content: [''],
      },
      {
        validators: [this.checkContent],
      },
    );
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.postId = id;
        this.getComments(id);
      }
    });
  }
  getComments(id: string) {
    this.postsService.getPostComments(id).subscribe({
      next: (res: any) => {
        this.commentsLoading.set(true);
        this.comments.set(res?.data?.comments);
      },
      error: (err) => {
        this.sweetAlertService.fireSwal(err?.message, 'error');
      },
    });
  }

  fomatTime(data: string) {
    return this.timeService.timeAgoShort(data);
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
    if (this.selectedImgObj) {
      formData.append('image', this.selectedImgObj);
    }
    return formData;
  }
  createComment() {
    this.isLoading.set(true);

    this.commentsService.createcomment(this.createFormData(), this.postId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.clearForm();
        this.getComments(this.postId);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.sweetAlertService.fireSwal('failed to create comment', 'error');
      },
    });
  }
  clearForm() {
    this.commentForm.reset({
      content: '',
    });
    this.selectedImgObj = null;
    this.imgSrc = null;
  }
  get getPostContentController() {
    return this.commentForm.get('content');
  }

  uploadImg(event: any) {
    this.selectedImgObj = event?.target?.files[0];
    if (this.selectedImgObj) {
      this.imgSrc = URL.createObjectURL(this.selectedImgObj);
    }
  }

  removeUploadedImg() {
    this.imgSrc = null;
    this.selectedImgObj = null;
  }
  toggleEmojes() {
    this.showEmojes = !this.showEmojes;
  }
  writeEmoji(event: any) {
    const emoji = this.commentForm.get('content')?.value + event.emoji.native;
    this.commentForm.get('content')?.setValue(emoji);
  }
  deleteComment(id: string) {
    this.isLoading.set(true);
    this.commentsService.deleteComment(id, this.postId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.getComments(this.postId);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.sweetAlertService.fireSwal('failed to delete comment', 'error');
      },
    });
  }
  likeUnlikeComment(commentId: string) {
    this.commentsService.likeUnlikeComment(this.postId, commentId).subscribe({
      next: (res: any) => {
        this.getComments(this.postId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
