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
import { Icomment } from '../../../models/comments/Icomment.js';
import { TimeShortAgoPipe } from '../../../../shared/pipes/time-short-age/timeShortAgo.pipe.js';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { CommentsService } from '../../../services/comments/comments.service.js';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';

@Component({
  selector: 'app-reply-card',
  templateUrl: './reply-card.component.html',
  styleUrls: ['./reply-card.component.css'],
  imports: [TimeShortAgoPipe],
})
export class ReplyCardComponent implements OnInit, OnChanges, OnDestroy {
  reply: InputSignal<Icomment> = input.required();
  otherUser: WritableSignal<boolean> = signal(false);
  isDeleted: WritableSignal<boolean> = signal(false);
  isLiked: WritableSignal<boolean> = signal(false);
  likeLoading: WritableSignal<boolean> = signal(false);
  deleteLoading: WritableSignal<boolean> = signal(false);
  likeCount: WritableSignal<number> = signal(0);
  deleteReplytEvent = output<string>();
  private destroy$ = new Subject<void>();
  constructor(
    private authService: AuthService,
    private commentsService: CommentsService,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.isLiked.set(this.reply().likes.includes(this.userDataId!));
    this.otherUser.set(this.reply().commentCreator._id !== this.userDataId);
    this.likeCount.set(this.reply().likes.length);
  }

  get userDataId() {
    return this.authService.getUserData()?._id;
  }

  deleteComment(id: string) {
    this.deleteLoading.set(true);
    this.commentsService
      .deleteComment(id, this.reply().post)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.deleteLoading.set(false);
          this.isDeleted.set(true);
          this.deleteReplytEvent.emit('reply deleted');
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
      .likeUnlikeComment(this.reply().post, commentId)
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

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
