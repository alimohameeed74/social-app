import { TimeService } from '../../../core/services/time/time.service.js';
import { Inotification } from '../../models/notification/Inotification.js';
import { NotificationsService } from './../../services/notifications/notifications.service';
import { Component, OnInit, signal } from '@angular/core';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component';
import { Router } from '@angular/router';
import { ContentLoaderComponent } from '../../../core/layouts/components/content-loader/content-loader.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [LoaderComponent, ContentLoaderComponent],
})
export class NotificationsComponent implements OnInit {
  isloading = signal<boolean>(false);
  notifications = signal<Inotification[]>([]);
  readCount: number = 0;
  constructor(
    private notificationsService: NotificationsService,
    private timeService: TimeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getMyNotifications();
  }

  getMyNotifications() {
    this.isloading.set(true);
    this.notificationsService.getAllNotifications().subscribe({
      next: (res: any) => {
        this.isloading.set(false);
        this.notifications.set(res?.data?.notifications);
        this.getNumberOfReadNotifications();
      },
      error: (err) => {
        this.isloading.set(false);
        console.log(err);
      },
    });
  }

  formatTime(data: string) {
    return this.timeService.timeAgoShort(data);
  }
  readNotification(id: string) {
    this.notificationsService.makeNotificationAsRead(id).subscribe({
      next: (res: any) => {
        this.getMyNotifications();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  readAllNotifications() {
    this.notificationsService.makeAllNotificationAsRead().subscribe({
      next: (res) => {
        this.getMyNotifications();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getNumberOfReadNotifications() {
    this.notifications().forEach((elem) => {
      if (elem.isRead) this.readCount++;
    });
  }

  goToPostDetails(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }

  goToProfile(userId: string) {
    this.router.navigate([`/main/profile/${userId}`]);
  }
}
