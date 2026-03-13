import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Isuggest } from '../../models/follow-suggestions/Isuggest.js';
import { environment } from '../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class FollowSuggestionsService {
  constructor(private httpClient: HttpClient) {}
  getFollowSuggestions(): Observable<Isuggest[]> {
    return this.httpClient.get<Isuggest[]>(`${environment.apiURL}/users/suggestions?limit=10`, {
      headers: environment.headers,
    });
  }
  getMoreFollowSuggestions(limit: number): Observable<Isuggest[]> {
    return this.httpClient.get<Isuggest[]>(
      `${environment.apiURL}/users/suggestions?limit=${limit}`,
      {
        headers: environment.headers,
      },
    );
  }
  followUnfollowUser(userId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.apiURL}/users/${userId}/follow`,
      {},
      {
        headers: environment.headers,
      },
    );
  }
}
