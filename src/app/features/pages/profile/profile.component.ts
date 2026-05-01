import { AuthService } from './../../../core/auth/services/auth.service';
import { ProfileService } from './../../services/my-profile/profile.service';
import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProfileHeaderComponent } from '../../components/profile-components/profile-header/profile-header.component';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component';
import { ProfilePostsComponent } from '../../components/profile-components/profile-posts/profile-posts.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IanotherUserProfile, User } from '../../models/users/Ianother-user-profile.js';
import { InternetConnectionComponent } from '../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../shared/components/error/error.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    ProfileHeaderComponent,
    LoaderComponent,
    ProfilePostsComponent,
    InternetConnectionComponent,
    ErrorComponent,
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading: WritableSignal<boolean> = signal(true);
  profileDetails: WritableSignal<User | null> = signal(null);
  isFollowing: WritableSignal<boolean | null> = signal(null);
  private destroy$ = new Subject<void>();
  offline: WritableSignal<boolean> = signal(false);
  errorHappend: WritableSignal<boolean> = signal(false);
  otherUser: WritableSignal<boolean> = signal(false);
  counter = 0;
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (!id || id === this.authService.getUserData()?._id) {
        this.getMyProfile();
      } else {
        this.getUserProfile(id);
      }
    });
  }

  getMyProfile() {
    this.isLoading.set(true);
    this.profileService
      .getMyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: User) => {
          this.isLoading.set(false);
          this.profileDetails.set(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (!navigator.onLine) {
            this.offline.set(true);
          } else {
            this.errorHappend.set(true);
          }
        },
      });
  }

  getUserProfile(userId: string) {
    this.isLoading.set(true);
    this.profileService
      .getUserProfile(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: IanotherUserProfile) => {
          this.isLoading.set(false);
          this.profileDetails.set(res.user);
          this.isFollowing.set(res.isFollowing);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (!navigator.onLine) {
            this.offline.set(true);
          } else {
            this.errorHappend.set(true);
          }
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
