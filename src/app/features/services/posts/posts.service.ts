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
}
