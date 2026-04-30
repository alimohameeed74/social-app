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

@Component({
  selector: 'app-profile-post-card',
  templateUrl: './profile-post-card.component.html',
  styleUrls: ['./profile-post-card.component.css'],
  imports: [FormatTimePipe],
})
export class ProfilePostCardComponent implements OnInit, OnChanges, OnDestroy {
  post: InputSignal<Ipost> = input.required();
  otherUser: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);
  hide: WritableSignal<boolean> = signal(false);
  isDeleted = output<string>();
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private sweetAlertService: SweetAlertService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id && id !== this.authService.getUserData()?._id) {
        this.otherUser.set(true);
      }
    });
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

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
