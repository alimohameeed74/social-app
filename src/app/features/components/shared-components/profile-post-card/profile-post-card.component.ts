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
import { Ipost } from '../../../models/posts/Ipost';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../services/my-profile/profile.service';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { FormatTimePipe } from '../../../../shared/pipes/format-time/formatTime.pipe.js';
import { SharedPostCardComponent } from '../shared-post-card/shared-post-card.component';
import { PostsService } from '../../../services/posts/posts.service.js';

@Component({
  selector: 'app-profile-post-card',
  templateUrl: './profile-post-card.component.html',
  styleUrls: ['./profile-post-card.component.css'],
  imports: [FormatTimePipe, SharedPostCardComponent],
})
export class ProfilePostCardComponent implements OnInit, OnChanges, OnDestroy {
  post: InputSignal<Ipost> = input.required();
  otherUser: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);
  isLoading_: WritableSignal<boolean> = signal(false);
  hide: WritableSignal<boolean> = signal(false);
  isDeleted = output<string>();
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
    private postsService: PostsService,
  ) {}

  ngOnInit() {}
  ngOnChanges(): void {
    const id = this.post().user._id;
    if (id && id !== this.authService.getUserData()?._id) {
      this.otherUser.set(true);
    }
  }
  goToPostDetails(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }

  editPost(i: string) {}
  deletePost(id: string) {
    this.isLoading.set(true);
    this.profileService
      .deletePost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.hide.set(true);
          this.isDeleted.emit('deleted');
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

  toggleSavePost(id: string) {
    this.isLoading_.set(true);
    this.postsService
      .togglePost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: boolean) => {
          this.isLoading_.set(false);
          this.post().bookmarked = res;
        },
        error: (err) => {
          this.isLoading_.set(false);

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
