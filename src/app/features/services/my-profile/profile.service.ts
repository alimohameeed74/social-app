import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  getMyProfile(): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/users/profile-data`, {
      headers: environment.headers,
    });
  }
  getMyposts(): Observable<any> {
    return this.httpClient.get(`${environment.apiURL}/posts/feed?only=me&limit=20`, {
      headers: environment.headers,
    });
  }
}
