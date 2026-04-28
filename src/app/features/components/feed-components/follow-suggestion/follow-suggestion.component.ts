import { Router } from '@angular/router';
import { Isuggest } from '../../../models/follow-suggestions/Isuggest.js';
import { FollowSuggestionsService } from './../../../services/follow-suggestions/follow-suggestions.service';
import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SuggestionCardComponent } from '../suggestion-card/suggestion-card.component';
import { SuggestionSkeltonComponent } from '../../../../shared/components/suggestion-skelton/suggestion-skelton.component';
import { InternetConnectionComponent } from '../../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';

@Component({
  selector: 'app-follow-suggestion',
  templateUrl: './follow-suggestion.component.html',
  styleUrls: ['./follow-suggestion.component.css'],
  imports: [
    SuggestionCardComponent,
    SuggestionSkeltonComponent,
    InternetConnectionComponent,
    ErrorComponent,
  ],
})
export class FollowSuggestionComponent implements OnInit, OnDestroy {
  suggestions: WritableSignal<Isuggest[]> = signal([]);
  offline: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  constructor(
    private followSuggestionsService: FollowSuggestionsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getMyFollowSuggestions();
  }
  getMyFollowSuggestions() {
    this.isLoading.set(true);
    this.followSuggestionsService
      .getFollowSuggestions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Isuggest[]) => {
          this.isLoading.set(false);

          if (res.length === 0) {
            this.suggestions.set([]);
          } else {
            this.suggestions.set(res);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.suggestions.set([]);
          if (!navigator.onLine) {
            this.offline.set(true);
          } else {
            this.error.set(true);
          }
        },
      });
  }
  goToSuggestions() {
    this.router.navigate(['/main/suggestions']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
