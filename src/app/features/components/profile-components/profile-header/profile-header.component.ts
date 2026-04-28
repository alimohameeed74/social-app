import { FollowSuggestionsService } from './../../../services/follow-suggestions/follow-suggestions.service';
import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { User } from '../../../models/users/Ianother-user-profile.js';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
})
export class ProfileHeaderComponent implements OnInit, OnChanges, OnDestroy {
  accoutUser: InputSignal<User | null> = input.required();
  otherUser: WritableSignal<boolean> = signal(false);
  isFollowing: InputSignal<boolean | null> = input.required();
  followUser: WritableSignal<boolean | null> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private followSuggestionsService: FollowSuggestionsService,
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id && id !== this.authService.getUserData()?._id) {
        this.otherUser.set(true);
      }
    });
    this.followUser.set(this.isFollowing());
  }
  followUnfollowUser(userId: string) {
    this.isLoading.set(true);
    this.followSuggestionsService
      .followUnfollowUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.followUser.update((s) => !s);
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

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
