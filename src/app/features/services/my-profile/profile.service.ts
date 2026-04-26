import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.js';
import { map, Observable } from 'rxjs';
import { IaccountUser } from '../../models/account-user/Iaccount-user.js';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  getMyProfile(): Observable<IaccountUser> {
    return this.httpClient
      .get<{ success: string; message: string; data: IaccountUser }>(
        `${environment.apiURL}/users/profile-data`,
        {
          headers: environment.headers,
        },
      )
      .pipe(map((res) => res.data));
  }
  getUserProfile(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/users/${userId}/profile`, {
      headers: environment.headers,
    });
  }
  getMyposts(): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/posts/feed?only=me&limit=20`, {
      headers: environment.headers,
    });
  }
  getUserposts(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/users/${userId}/posts`, {
      headers: environment.headers,
    });
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiURL}/posts/${postId}`, {
      headers: environment.headers,
    });
  }
}
