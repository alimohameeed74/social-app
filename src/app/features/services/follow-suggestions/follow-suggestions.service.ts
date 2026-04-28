import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Isuggest } from '../../models/follow-suggestions/Isuggest.js';
import { environment } from '../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class FollowSuggestionsService {
  constructor(private httpClient: HttpClient) {}
  getFollowSuggestions(): Observable<Isuggest[]> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: {
          suggestions: Isuggest[];
        };
      }>(`${environment.apiURL}/users/suggestions?limit=10`)
      .pipe(map((res) => res.data.suggestions));
  }
  getMoreFollowSuggestions(limit: number): Observable<Isuggest[]> {
    return this.httpClient
      .get<{
        success: string;
        message: string;
        data: {
          suggestions: Isuggest[];
        };
      }>(`${environment.apiURL}/users/suggestions?limit=${limit}`)
      .pipe(map((res) => res.data.suggestions));
  }
  followUnfollowUser(userId: string): Observable<any> {
    return this.httpClient.put(`${environment.apiURL}/users/${userId}/follow`, {});
  }
}
