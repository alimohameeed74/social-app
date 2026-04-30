import { Icomment } from './../../models/comments/Icomment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.js';
import { Ipost } from '../../models/posts/Ipost.js';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private httpClient: HttpClient) {}

  createPost(data: FormData): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/posts`, data);
  }
  getAllPosts(): Observable<Ipost[]> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: {
          posts: Ipost[];
        };
      }>(`${environment.apiURL}/posts`)
      .pipe(map((res) => res.data.posts));
  }
  getPostComments(postId: string): Observable<Icomment[]> {
    return this.httpClient.get<Icomment[]>(
      `${environment.apiURL}/posts/${postId}/comments?page=1&limit=10`,
      {
        headers: environment.headers,
      },
    );
  }
  getPostDetails(postId: string): Observable<Ipost> {
    return this.httpClient.get<Ipost>(`${environment.apiURL}/posts/${postId}`, {
      headers: environment.headers,
    });
  }
  togglePost(postId: string): Observable<boolean> {
    return this.httpClient
      .put<{
        sunccess: string;
        message: string;
        data: {
          bookmarked: boolean;
        };
      }>(`${environment.apiURL}/posts/${postId}/bookmark`, {})
      .pipe(map((res) => res.data.bookmarked));
  }
  likeUnlikePost(postId: string): Observable<number> {
    return this.httpClient
      .put<{
        success: string;
        message: string;
        data: {
          liked: boolean;
          likesCount: number;
          post: Ipost;
        };
      }>(`${environment.apiURL}/posts/${postId}/like`, {})
      .pipe(map((res) => res.data.likesCount));
  }
  getPostLikes(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/posts/${postId}/likes?page=1&limit=10`, {
      headers: environment.headers,
    });
  }
  updatePost(postId: string, data: FormData): Observable<any> {
    return this.httpClient.put(`${environment.apiURL}/posts/${postId}`, data);
  }
}
