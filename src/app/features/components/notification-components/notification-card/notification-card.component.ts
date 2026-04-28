import {
  Component,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Inotification } from '../../../models/notification/Inotification.js';
import { Router } from '@angular/router';
import { FormatTimePipe } from '../../../../shared/pipes/format-time/formatTime.pipe.js';
import { NotificationsService } from '../../../services/notifications/notifications.service.js';
import { Subject, take, takeUntil } from 'rxjs';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css'],
  imports: [FormatTimePipe],
})
export class NotificationCardComponent implements OnInit, OnDestroy {
  notification: InputSignal<Inotification> = input.required();
  isLoading: WritableSignal<boolean> = signal(false);
  isLoading_: WritableSignal<boolean> = signal(false);
  isRead: WritableSignal<boolean> = signal(false);

  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {}

  goToProfile(userId: string) {
    this.router.navigate([`/main/profile/${userId}`]);
  }

  goToPostDetails(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }

  readNotification(id: string) {
    this.isLoading.set(true);
    this.notificationsService
      .makeNotificationAsRead(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.isRead.set(true);
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
