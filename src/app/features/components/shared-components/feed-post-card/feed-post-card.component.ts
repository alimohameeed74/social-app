import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { Router, RouterLink } from '@angular/router';
import { PostsService } from '../../../services/posts/posts.service.js';
import { FormatTimePipe } from '../../../../shared/pipes/format-time/formatTime.pipe.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../../services/my-profile/profile.service.js';
import { TimeShortAgoPipe } from '../../../../shared/pipes/time-short-age/timeShortAgo.pipe.js';

@Component({
  selector: 'app-feed-post-card',
  templateUrl: './feed-post-card.component.html',
  styleUrls: ['./feed-post-card.component.css'],
  imports: [RouterLink, TimeShortAgoPipe],
})
export class FeedPostCardComponent implements OnInit, OnChanges {
  post: InputSignal<Ipost> = input.required();
  isLoading: WritableSignal<boolean> = signal(false);
  deleteLoading: WritableSignal<boolean> = signal(false);
  likeLoading: WritableSignal<boolean> = signal(false);
  isLiked: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  otherUser: WritableSignal<boolean> = signal(false);
  isDeleted: WritableSignal<boolean> = signal(false);
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
          this.post().bookmarked = res;
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

  editPost(i: string) {}
  deletePost(id: string) {
    this.deleteLoading.set(true);
    this.profileService
      .deletePost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.deleteLoading.set(false);
          this.isDeleted.set(true);
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

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
