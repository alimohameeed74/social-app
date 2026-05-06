import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { Router, RouterLink } from '@angular/router';
import { PostsService } from '../../../services/posts/posts.service.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../../services/my-profile/profile.service.js';
import { TimeShortAgoPipe } from '../../../../shared/pipes/time-short-age/timeShortAgo.pipe.js';
import { SharedPostCardComponent } from '../shared-post-card/shared-post-card.component';
import { SharedPostModalComponent } from '../shared-post-modal/shared-post-modal.component';
import { PostCommentsComponent } from '../../feed-components/post-comments/post-comments.component';
import { LikesModalComponent } from '../../feed-components/likes-modal/likes-modal.component';

@Component({
  selector: 'app-feed-post-card',
  templateUrl: './feed-post-card.component.html',
  styleUrls: ['./feed-post-card.component.css'],
  imports: [
    RouterLink,
    TimeShortAgoPipe,
    SharedPostCardComponent,
    SharedPostModalComponent,
    PostCommentsComponent,
    LikesModalComponent,
  ],
})
export class FeedPostCardComponent implements OnInit, OnChanges {
  post: InputSignal<Ipost> = input.required();
  isLoading: WritableSignal<boolean> = signal(false);
  deleteLoading: WritableSignal<boolean> = signal(false);
  modalOpened: WritableSignal<boolean> = signal(false);
  likesModalOpened: WritableSignal<boolean> = signal(false);
  likeLoading: WritableSignal<boolean> = signal(false);
  isLiked: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  otherUser: WritableSignal<boolean> = signal(false);
  isDeleted: WritableSignal<boolean> = signal(false);
  isSaved: WritableSignal<boolean> = signal(false);
  deletePostEvent = output<string>();
  sharedPostEvent = output<string>();
  showTopComment: WritableSignal<boolean> = signal(true);
  constructor(
    private router: Router,
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.isLiked.set(this.post().likes.includes(this.userDataId!));
    this.isSaved.set(this.post().bookmarked);
    this.otherUser.set(this.post().user._id !== this.userDataId);
  }

  get userDataId() {
    return this.authService.getUserData()?._id;
  }

  goToPostComments(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }

  likeUnlikePost(id: string) {
    this.likeLoading.set(true);
    this.postsService
      .likeUnlikePost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: number) => {
          this.isLiked.update((s) => !s);
          this.likeLoading.set(false);
          this.post().likesCount = res;
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

  toggleSavePost(id: string) {
    this.isLoading.set(true);
    this.postsService
      .togglePost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: boolean) => {
          this.isLoading.set(false);
          this.isSaved.set(res);
        },
        error: (err) => {
          this.isLoading.set(false);

          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
  }

  deletePost(id: string) {
    this.deleteLoading.set(true);
    this.profileService
      .deletePost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.deleteLoading.set(false);
          this.isDeleted.set(true);
          this.deletePostEvent.emit('deleted');
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

  closeModal() {
    this.modalOpened.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  sharePost(event: boolean) {
    this.closeModal();
    this.sharedPostEvent.emit('post shared');
  }
  openShareModal() {
    this.modalOpened.set(true);
  }

  openLikeModal() {
    this.likesModalOpened.set(true);
  }
  closeLikesModal() {
    this.likesModalOpened.set(false);
  }

  viewAllComments() {
    this.showTopComment.update((s) => !s);
  }
}
