import { FollowSuggestionsService } from './../../../services/follow-suggestions/follow-suggestions.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { User } from '../../../models/users/Ianother-user-profile.js';
import { Subject, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { ProfileService } from '../../../services/my-profile/profile.service.js';

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
  changeLoading: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  imgSrc: WritableSignal<string | ArrayBuffer | null> = signal(null);
  selectedImgObj: WritableSignal<File | null> = signal(null);
  showConfirmationModal: WritableSignal<boolean> = signal(false);
  changedProfilePhotoEvent = output<string>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private followSuggestionsService: FollowSuggestionsService,
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
    private profileService: ProfileService,
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

  holdUserPhoto(event: any) {
    this.selectedImgObj.set(event?.target?.files[0]);
    if (this.selectedImgObj()) {
      this.imgSrc.set(URL.createObjectURL(this.selectedImgObj()!));
      this.showConfirmationModal.set(true);
    }

    event.target.value = null;
  }

  get userData() {
    return this.authService.getUserData();
  }

  createFormData() {
    const formData = new FormData();

    if (this.selectedImgObj()) {
      formData.append('photo', this.selectedImgObj()!);
    }
    return formData;
  }

  updatedProfilePhoto() {
    this.changeLoading.set(true);
    this.profileService
      .uploadProfilePhoto(this.createFormData())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { message: string; photo: string }) => {
          this.changeLoading.set(false);
          this.sweetAlertService.fireSwal(res.message, 'success');
          this.authService.holdUserData({ ...this.userData!, photo: res.photo });
          this.changedProfilePhotoEvent.emit('profile photo changed');
          localStorage.setItem('userData', JSON.stringify(this.authService.getUserData()));
          this.closeModal();
        },
        error: (err) => {
          this.changeLoading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
  }

  closeModal() {
    this.imgSrc.set('');
    this.selectedImgObj.set(null);
    if (this.changeLoading()) this.destroy$.next();
    this.showConfirmationModal.set(false);
  }
}
