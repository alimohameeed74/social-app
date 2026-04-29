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

@Component({
  selector: 'app-feed-post-card',
  templateUrl: './feed-post-card.component.html',
  styleUrls: ['./feed-post-card.component.css'],
  imports: [RouterLink, FormatTimePipe],
})
export class FeedPostCardComponent implements OnInit, OnChanges {
  post: InputSignal<Ipost> = input.required();
  isLoading: WritableSignal<boolean> = signal(false);
  likeLoading: WritableSignal<boolean> = signal(false);
  isLiked: WritableSignal<boolean> = signal(false);
  constructor(
    private router: Router,
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
  ) {}

  ngOnInit() {}

  ngOnChanges(): void {
    this.isLiked.set(this.post().likes.includes(this.userDataId!));
  }

  get userDataId() {
    return this.authService.getUserData()?._id;
  }

  goToPostComments(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }

  likeUnlikePost(id: string) {
    this.likeLoading.set(true);
    this.postsService.likeUnlikePost(id).subscribe({
      next: (res: any) => {
        this.isLiked.update((s) => !s);
        this.likeLoading.set(false);
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
    this.postsService.togglePost(id).subscribe({
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
}
