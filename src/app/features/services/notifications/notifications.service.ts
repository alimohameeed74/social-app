import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inotification } from '../../models/notification/Inotification.js';
import { environment } from '../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private httpClient: HttpClient) {}

  getAllNotifications(): Observable<Inotification[]> {
    return this.httpClient.get<Inotification[]>(`${environment.apiURL}/notifications?limit=30`, {
      headers: environment.headers,
    });
  }
  makeNotificationAsRead(notificationId: string): Observable<any> {
    return this.httpClient.patch(
      `${environment.apiURL}/notifications/${notificationId}/read`,
      {},
      {
        headers: environment.headers,
      },
    );
  }
  makeAllNotificationAsRead(): Observable<any> {
    return this.httpClient.patch(
      `${environment.apiURL}/notifications/read-all`,
      {},
      {
        headers: environment.headers,
      },
    );
  }
}
