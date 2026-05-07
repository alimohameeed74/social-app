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
import { Icomment } from '../../../models/comments/Icomment.js';
import { TimeShortAgoPipe } from '../../../../shared/pipes/time-short-age/timeShortAgo.pipe.js';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { CommentsService } from '../../../services/comments/comments.service.js';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { CommentRepliesComponent } from '../comment-replies/comment-replies.component';
import { EditCommentComponent } from '../../shared-components/edit-comment/edit-comment.component';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css'],
  imports: [TimeShortAgoPipe, CommentRepliesComponent, EditCommentComponent],
})
export class CommentCardComponent implements OnInit, OnChanges, OnDestroy {
  comment: InputSignal<Icomment> = input.required();
  copyComment: WritableSignal<Icomment | null> = signal(null);
  otherUser: WritableSignal<boolean> = signal(false);
  isDeleted: WritableSignal<boolean> = signal(false);
  isLiked: WritableSignal<boolean> = signal(false);
  likeLoading: WritableSignal<boolean> = signal(false);
  deleteLoading: WritableSignal<boolean> = signal(false);
  showReply: WritableSignal<boolean> = signal(false);
  likeCount: WritableSignal<number> = signal(0);
  replyCount: WritableSignal<number> = signal(0);
  deleteCommentEvent = output<string>();
  showEditCommentModal: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  constructor(
    private authService: AuthService,
    private commentsService: CommentsService,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.copyComment.set(this.comment());
    this.replyCount.set(this.comment().repliesCount!);
    this.isLiked.set(this.comment().likes.includes(this.userDataId!));
    this.otherUser.set(this.comment().commentCreator._id !== this.userDataId);
    this.likeCount.set(this.comment().likes.length);
  }
  get userDataId() {
    return this.authService.getUserData()?._id;
  }
  deleteComment(id: string) {
    this.deleteLoading.set(true);
    this.commentsService
      .deleteComment(id, this.comment().post)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.deleteLoading.set(false);
          this.isDeleted.set(true);
          this.deleteCommentEvent.emit('comment deleted');
        },
        error: (err) => {
          this.deleteLoading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
  }
  likeUnlikeComment(commentId: string) {
    this.likeLoading.set(true);
    this.commentsService
      .likeUnlikeComment(this.comment().post, commentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { liked: boolean; likesCount: number }) => {
          this.likeLoading.set(false);
          this.likeCount.set(res.likesCount);
          this.isLiked.set(res.liked);
        },
        error: (err) => {
          this.likeLoading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
  }

  showCommentReplies() {
    this.showReply.update((s) => !s);
  }
  decreaseReplyCount() {
    this.replyCount.update((s) => s - 1);
    if (this.replyCount() < 0) {
      this.replyCount.set(0);
    }
  }

  increaseReplyCount() {
    this.replyCount.update((s) => s + 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  handleUpdateComment(event: Icomment) {
    this.copyComment.set(event);
    this.showEditCommentModal.set(false);
  }
}
