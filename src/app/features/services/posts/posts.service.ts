import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.js';

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
}
