import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Inotification } from '../../models/notification/Inotification.js';
import { environment } from '../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private httpClient: HttpClient) {}

  getAllNotifications(): Observable<{ notifications: Inotification[]; total: number }> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: {
          notifications: Inotification[];
        };
        meta: {
          feedMode: string;
          pagination: {
            currentPage: number;
            limit: number;
            total: number;
            numberOfPages: number;
          };
        };
      }>(`${environment.apiURL}/notifications?unread=false&limit=30`)
      .pipe(
        map((res) => {
          return { notifications: res.data.notifications, total: res.meta.pagination.total };
        }),
      );
  }
  makeNotificationAsRead(notificationId: string): Observable<any> {
    return this.httpClient.patch(`${environment.apiURL}/notifications/${notificationId}/read`, {});
  }
  makeAllNotificationAsRead(): Observable<any> {
    return this.httpClient.patch(`${environment.apiURL}/notifications/read-all`, {});
  }
  getNotificationsCount(): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/notifications/unread-count`, {
      headers: environment.headers,
    });
  }
}
