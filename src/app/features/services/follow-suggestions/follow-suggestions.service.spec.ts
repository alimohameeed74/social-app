/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FollowSuggestionsService } from './follow-suggestions.service';

describe('Service: FollowSuggestions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FollowSuggestionsService]
    });
  });

  it('should ...', inject([FollowSuggestionsService], (service: FollowSuggestionsService) => {
    expect(service).toBeTruthy();
  }));
});
