import {
  Component,
  input,
  Input,
  InputSignal,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { PostsService } from '../../../services/posts/posts.service.js';
import { FeedPostCardComponent } from '../../shared-components/feed-post-card/feed-post-card.component';
import { InternetConnectionComponent } from '../../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { Subject, takeUntil } from 'rxjs';
import { FeedPostSkeltonComponent } from '../../../../shared/components/feed-post-skelton/feed-post-skelton.component';

@Component({
  selector: 'app-posts-cards',
  templateUrl: './posts-cards.component.html',
  styleUrls: ['./posts-cards.component.css'],
  imports: [
    FeedPostCardComponent,
    InternetConnectionComponent,
    ErrorComponent,
    FeedPostSkeltonComponent,
  ],
})
export class PostsCardsComponent implements OnInit, OnDestroy {
  post: InputSignal<string> = input.required();
  posts: WritableSignal<Ipost[]> = signal([]);
  offline: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  contentLoading: WritableSignal<boolean> = signal(false);
  emptyPosts: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  constructor(private postsService: PostsService) {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.getPosts();
  }

  getPosts() {
    this.contentLoading.set(true);
    this.postsService
      .getAllPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Ipost[]) => {
          this.contentLoading.set(false);
          if (res.length === 0) {
            this.emptyPosts.set(true);
          } else {
            this.posts.set(res);
          }
        },
        error: (err) => {
          this.contentLoading.set(false);
          this.posts.set([]);
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
