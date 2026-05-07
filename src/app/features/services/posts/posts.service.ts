import { Icomment } from './../../models/comments/Icomment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.js';
import { Ipost } from '../../models/posts/Ipost.js';
import { Iuser } from '../../models/users/Iuser.js';

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
    return this.httpClient
      .get<{
        success: boolean;
        message: string;
        data: { comments: Icomment[] };
      }>(`${environment.apiURL}/posts/${postId}/comments?page=1&limit=10`)
      .pipe(map((res) => res.data.comments));
  }
  getPostDetails(postId: string): Observable<Ipost> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: {
          post: Ipost;
        };
      }>(`${environment.apiURL}/posts/${postId}`)
      .pipe(map((res) => res.data.post));
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
  getPostLikes(postId: string): Observable<Iuser[]> {
    return this.httpClient
      .get<{
        success: boolean;
        message: string;
        data: { likes: Iuser[] };
      }>(`${environment.apiURL}/posts/${postId}/likes?page=1&limit=10`)
      .pipe(map((res) => res.data.likes));
  }
  updatePost(postId: string, data: FormData): Observable<{ post: Ipost; message: string }> {
    return this.httpClient
      .put<{
        seccess: string;
        message: string;
        data: { post: Ipost };
      }>(`${environment.apiURL}/posts/${postId}`, data)
      .pipe(
        map((res) => {
          return {
            post: res.data.post,
            message: res.message,
          };
        }),
      );
  }

  sharePost(postId: string, data: { body: string }): Observable<string> {
    if (data.body === '') {
      return this.httpClient
        .post<{
          success: boolean;
          message: string;
          data: {
            posts: Ipost;
          };
        }>(`${environment.apiURL}/posts/${postId}/share`, {})
        .pipe(map((res) => res.message));
    } else {
      return this.httpClient
        .post<{
          success: boolean;
          message: string;
          data: {
            posts: Ipost;
          };
        }>(`${environment.apiURL}/posts/${postId}/share`, data)
        .pipe(map((res) => res.message));
    }
  }
}
