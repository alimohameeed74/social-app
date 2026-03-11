import { Icomment } from './../../models/comments/Icomment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.js';
import { Ipost } from '../../models/posts/Ipost.js';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private httpClient: HttpClient) {}

  createPost(data: FormData): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/posts`, data, {
      headers: environment.headers,
    });
  }
  getAllPosts(): Observable<Ipost[]> {
    return this.httpClient.get<Ipost[]>(`${environment.apiURL}/posts`, {
      headers: environment.headers,
    });
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
  togglePost(postId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.apiURL}/posts/${postId}/bookmark`,
      {},
      {
        headers: environment.headers,
      },
    );
  }
  likeUnlikePost(postId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.apiURL}/posts/${postId}/like`,
      {},
      {
        headers: environment.headers,
      },
    );
  }
  getPostLikes(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/posts/${postId}/likes?page=1&limit=10`, {
      headers: environment.headers,
    });
  }
}
