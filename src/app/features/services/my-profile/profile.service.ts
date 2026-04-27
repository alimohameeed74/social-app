import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.js';
import { map, Observable } from 'rxjs';
import { IaccountUser } from '../../models/account-user/Iaccount-user.js';
import { IanotherUserProfile, User } from '../../models/users/Ianother-user-profile.js';
import { Ipost } from '../../models/posts/Ipost.js';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  getMyProfile(): Observable<User> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: IanotherUserProfile;
      }>(`${environment.apiURL}/users/profile-data`)
      .pipe(map((res) => res.data.user));
  }
  getUserProfile(userId: string): Observable<IanotherUserProfile> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: IanotherUserProfile;
      }>(`${environment.apiURL}/users/${userId}/profile`)
      .pipe(map((res) => res.data));
  }
  getMyposts(): Observable<Ipost[]> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: { posts: Ipost[] };
      }>(`${environment.apiURL}/posts/feed?only=me&limit=20`)
      .pipe(map((res) => res.data.posts));
  }
  getUserposts(userId: string): Observable<Ipost[]> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: { posts: Ipost[] };
      }>(`${environment.apiURL}/users/${userId}/posts`)
      .pipe(map((res) => res.data.posts));
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiURL}/posts/${postId}`, {
      headers: environment.headers,
    });
  }
}
