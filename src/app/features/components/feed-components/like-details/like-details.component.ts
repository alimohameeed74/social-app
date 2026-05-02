import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { PostsService } from '../../../services/posts/posts.service.js';
import { Iuser } from '../../../models/users/Iuser.js';
import { Subject, takeUntil } from 'rxjs';
import { InternetConnectionComponent } from '../../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { RouterLink } from '@angular/router';
import { LikeCardSkeltonComponent } from '../../../../shared/components/like-card-skelton/like-card-skelton.component';

@Component({
  selector: 'app-like-details',
  templateUrl: './like-details.component.html',
  styleUrls: ['./like-details.component.css'],
  imports: [RouterLink, InternetConnectionComponent, ErrorComponent, LikeCardSkeltonComponent],
})
export class LikeDetailsComponent implements OnInit, OnChanges, OnDestroy {
  postId: InputSignal<string> = input.required();
  likes: WritableSignal<Iuser[]> = signal([]);
  likesLoading: WritableSignal<boolean> = signal(false);
  emptyLikes: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  offline: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  constructor(private postsService: PostsService) {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.getPostLikes(this.postId());
  }
  getPostLikes(postId: string) {
    this.likesLoading.set(true);
    this.postsService
      .getPostLikes(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Iuser[]) => {
          this.likesLoading.set(false);
          if (res.length === 0) {
            this.likes.set([]);
            this.emptyLikes.set(true);
          } else {
            this.likes.set(res);
          }
        },
        error: (err) => {
          this.likesLoading.set(false);
          this.likes.set([]);
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
