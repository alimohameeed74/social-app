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
    return this.httpClient.get<Isuggest[]>(
      `https://route-posts.routemisr.com/users/suggestions?limit=10`,
      {
        headers: environment.headers,
      },
    );
  }
}
