import { Icomment } from './../../models/comments/Icomment';
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

  createReplyOnComment(postId: string, commentId: string, data: FormData): Observable<any> {
    return this.httpClient.post(
      `${environment.apiURL}/posts/${postId}/comments/${commentId}/replies`,
      data,
    );
  }
  getCommentReplies(postId: string, commentId: string): Observable<Icomment[]> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: {
          replies: Icomment[];
        };
      }>(`${environment.apiURL}/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`)
      .pipe(map((res) => res.data.replies));
  }
  editComment(
    postId: string,
    commentId: string,
    data: FormData,
  ): Observable<{ comment: Icomment; message: string }> {
    return this.httpClient
      .put<{
        message: string;
        success: string;
        data: { comment: Icomment };
      }>(`${environment.apiURL}/posts/${postId}/comments/${commentId}`, data)
      .pipe(
        map((res) => {
          return {
            comment: res.data.comment,
            message: res.message,
          };
        }),
      );
  }
}
