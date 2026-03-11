import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private httpClient: HttpClient) {}
  createcomment(data: FormData, postId: string): Observable<any> {
    return this.httpClient.post(`${environment.apiURL}/posts/${postId}/comments`, data, {
      headers: environment.headers,
    });
  }
  deleteComment(commentId: string, postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiURL}/posts/${postId}/comments/${commentId}`, {
      headers: environment.headers,
    });
  }
}
