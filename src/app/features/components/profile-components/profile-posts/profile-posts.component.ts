import { Component, Input, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { ProfileService } from '../../../services/my-profile/profile.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePostCardComponent } from '../../shared-components/profile-post-card/profile-post-card.component';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { Subject, takeUntil } from 'rxjs';
import { PostSkeltonComponent } from '../../../../shared/components/post-skelton/post-skelton.component';
import { InternetConnectionComponent } from '../../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css'],
  imports: [
    ProfilePostCardComponent,
    PostSkeltonComponent,
    InternetConnectionComponent,
    ErrorComponent,
  ],
})
export class ProfilePostsComponent implements OnInit, OnDestroy {
  posts: WritableSignal<Ipost[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  offline: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  otherUser: WritableSignal<boolean> = signal(false);
  contentLoading: WritableSignal<boolean> = signal(false);
  emptyPosts: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  postsCount: WritableSignal<number> = signal(0);
  deleteCount: WritableSignal<number> = signal(0);
  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id && id !== this.authService.getUserData()?._id) {
        this.otherUser.set(true);
        this.getUserPosts(id);
      } else {
        this.getPosts(); // My Posts
      }
    });
  }

  getPosts() {
    this.contentLoading.set(true);
    this.profileService
      .getMyposts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Ipost[]) => {
          this.contentLoading.set(false);
          this.postsCount.set(res.length);
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

  getUserPosts(id: string) {
    this.contentLoading.set(true);

    this.profileService
      .getUserposts(id)
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

  handlechange() {
    this.deleteCount.update((s) => s + 1);
    if (this.deleteCount() === this.postsCount()) {
      this.posts.set([]);
      this.emptyPosts.set(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
