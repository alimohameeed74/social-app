import { CommentsService } from './../../../services/comments/comments.service';
import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { PostsService } from '../../../services/posts/posts.service.js';
import { Icomment } from '../../../models/comments/Icomment.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { TimeService } from '../../../../core/services/time/time.service.js';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { Subject, take, takeUntil } from 'rxjs';
import { InternetConnectionComponent } from '../../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { CommentCardSkeltonComponent } from '../../../../shared/components/comment-card-skelton/comment-card-skelton.component';
import { CreateCommentComponent } from '../create-comment/create-comment.component';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css'],
  imports: [
    ReactiveFormsModule,
    CommentCardComponent,
    InternetConnectionComponent,
    ErrorComponent,
    CommentCardSkeltonComponent,
    CreateCommentComponent,
  ],
})
export class PostCommentsComponent implements OnInit, OnChanges, OnDestroy {
  comments: WritableSignal<Icomment[]> = signal([]);
  commentsLoading: WritableSignal<boolean> = signal(false);
  offline: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  emptyComments: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  postId: InputSignal<string> = input.required();
  deleteCommentEvent = output<string>();
  createCommentEvent = output<string>();
  private destroy$ = new Subject<void>();
  constructor(private postsService: PostsService) {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.getComments(this.postId());
  }
  getComments(id: string) {
    this.emptyComments.set(false);
    this.commentsLoading.set(true);
    this.comments.set([]);

    this.postsService
      .getPostComments(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Icomment[]) => {
          this.commentsLoading.set(false);
          if (res.length === 0) {
            this.comments.set([]);
            this.emptyComments.set(true);
          } else {
            this.comments.set(res);
          }
        },
        error: (err) => {
          this.commentsLoading.set(false);
          this.comments.set([]);
          if (!navigator.onLine) {
            this.offline.set(true);
          } else {
            this.error.set(true);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
