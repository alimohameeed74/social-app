import { IlikeCommentResponse } from './../../models/comments/Ilike-comment-response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private httpClient: HttpClient) {}
  createcomment(data: FormData, postId: string): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/posts/${postId}/comments`, data);
  }
  deleteComment(commentId: string, postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiURL}/posts/${postId}/comments/${commentId}`);
  }
  likeUnlikeComment(
    postId: string,
    commentId: string,
  ): Observable<{ liked: boolean; likesCount: number }> {
    return this.httpClient
      .put<{
        success: string;
        message: string;
        data: IlikeCommentResponse;
      }>(`${environment.apiURL}/posts/${postId}/comments/${commentId}/like`, {})
      .pipe(
        map((res) => {
          return {
            liked: res.data.liked,
            likesCount: res.data.likesCount,
          };
        }),
      );
  }
  updatecomment(postId: string, commentId: string, data: string): Observable<any> {
    return this.httpClient.put(
      `${environment.apiURL}/posts/${postId}/comments/${commentId}/like`,
      data,
      {
        headers: environment.headers,
      },
    );
  }
}
