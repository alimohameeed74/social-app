import { Inotification } from '../../models/notification/Inotification.js';
import { NotificationsService } from './../../services/notifications/notifications.service';
import { Component, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotificationCardComponent } from '../../components/notification-components/notification-card/notification-card.component';
import { InternetConnectionComponent } from '../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../shared/components/error/error.component';
import { NotificationSkeltonComponent } from '../../../shared/components/notification-skelton/notification-skelton.component';
import { SweetAlertService } from '../../../core/services/sweet-alert/sweet-alert.service.js';
import { NavbarComponent } from '../../../core/layouts/components/navbar/navbar.component.js';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [
    NotificationCardComponent,
    InternetConnectionComponent,
    ErrorComponent,
    NotificationSkeltonComponent,
  ],
})
export class NotificationsComponent implements OnInit {
  offline: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  isLoading_: WritableSignal<boolean> = signal(false);
  emptyNotifications: WritableSignal<boolean> = signal(false);
  notifications: WritableSignal<Inotification[]> = signal([]);
  readCount: WritableSignal<number> = signal(0);
  private destroy$ = new Subject<void>();
  constructor(
    private notificationsService: NotificationsService,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {
    this.getMyNotifications();
  }

  getMyNotifications() {
    this.isLoading.set(true);
    this.notificationsService
      .getAllNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { notifications: Inotification[]; total: number }) => {
          this.isLoading.set(false);
          if (res.total === 0) {
            this.emptyNotifications.set(true);
          } else {
            this.emptyNotifications.set(false);
            this.notifications.set(res.notifications);
            this.readCount.set(res.total);
          }
        },
        error: (err) => {
          this.isLoading.set(false);

          this.readCount.set(0);
          if (!navigator.onLine) {
            this.offline.set(true);
          } else {
            this.error.set(true);
            this.notifications.set([]);
          }
        },
      });
  }

  readAllNotifications() {
    this.isLoading_.set(true);
    this.notificationsService
      .makeAllNotificationAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading_.set(false);
          this.emptyNotifications.set(true);
          this.readCount.set(0);
        },
        error: (err) => {
          this.isLoading_.set(false);
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
