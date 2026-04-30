import { SweetAlertService } from './../../../../core/services/sweet-alert/sweet-alert.service';
import { PostsService } from './../../../services/posts/posts.service';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Ipost } from '../../../models/posts/Ipost.js';
import { FeedPostCardComponent } from '../../shared-components/feed-post-card/feed-post-card.component';
import { FeedPostSkeltonComponent } from '../../../../shared/components/feed-post-skelton/feed-post-skelton.component';
import { Subject, takeUntil } from 'rxjs';
import { InternetConnectionComponent } from '../../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
  imports: [
    FeedPostCardComponent,
    FeedPostSkeltonComponent,
    InternetConnectionComponent,
    ErrorComponent,
  ],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  post: WritableSignal<Ipost | null> = signal(null);
  isLoading: WritableSignal<boolean> = signal(false);
  showComments: WritableSignal<boolean> = signal(false);
  showLikes: WritableSignal<boolean> = signal(false);
  emptyPost: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  offline: WritableSignal<boolean> = signal(false);
  private destry$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private loc: Location,
    private postsService: PostsService,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getPostDetails(id);
      }
    });
  }
  back() {
    this.loc.back();
  }

  getPostDetails(id: string) {
    this.isLoading.set(true);
    this.postsService
      .getPostDetails(id)
      .pipe(takeUntil(this.destry$))
      .subscribe({
        next: (res: Ipost) => {
          this.isLoading.set(false);
          this.post.set(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (!navigator.onLine) {
            this.offline.set(true);
          } else if (err?.statusCode === 404) {
            this.emptyPost.set(true);
          } else {
            this.error.set(true);
          }
        },
      });
  }
  handleChange(event: string) {
    this.emptyPost.set(true);
  }

  ngOnDestroy(): void {
    this.destry$.next();
  }
}
