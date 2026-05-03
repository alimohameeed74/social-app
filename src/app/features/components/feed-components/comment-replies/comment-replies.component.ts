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
import { InternetConnectionComponent } from '../../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { CreateReplyComponent } from '../create-reply/create-reply.component';
import { ReplyCardComponent } from '../reply-card/reply-card.component';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from '../../../services/comments/comments.service.js';
import { Icomment } from '../../../models/comments/Icomment.js';
import { CommentCardSkeltonComponent } from '../../../../shared/components/comment-card-skelton/comment-card-skelton.component';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css'],
  imports: [
    InternetConnectionComponent,
    ErrorComponent,
    CreateReplyComponent,
    ReplyCardComponent,
    CommentCardSkeltonComponent,
  ],
})
export class CommentRepliesComponent implements OnInit, OnChanges, OnDestroy {
  replies: WritableSignal<Icomment[]> = signal([]);
  parentCommentName: InputSignal<string> = input.required();
  repliesLoading: WritableSignal<boolean> = signal(false);
  offline: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  emptyReplies: WritableSignal<boolean> = signal(false);
  postId: InputSignal<string> = input.required();
  commentId: InputSignal<string> = input.required();
  deleteReplyEvent = output<string>();
  createReplyEvent = output<string>();
  private destroy$ = new Subject<void>();
  constructor(private commentService: CommentsService) {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.getReplies();
  }

  getReplies() {
    this.emptyReplies.set(false);
    this.repliesLoading.set(true);
    this.replies.set([]);
    this.commentService
      .getCommentReplies(this.postId(), this.commentId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Icomment[]) => {
          this.repliesLoading.set(false);
          if (res.length === 0) {
            this.replies.set([]);
            this.emptyReplies.set(true);
          } else {
            this.replies.set(res);
          }
        },
        error: (err) => {
          this.repliesLoading.set(false);
          this.replies.set([]);
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

  handleDeleteReply(event: string) {
    this.deleteReplyEvent.emit('reply deleted');
    this.getReplies();
  }
}
