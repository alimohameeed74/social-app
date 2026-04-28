import { FollowSuggestionsService } from './../../services/follow-suggestions/follow-suggestions.service';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component';
import { Isuggest } from '../../models/follow-suggestions/Isuggest.js';
import { count } from 'console';
import { Router } from '@angular/router';
import { SuggestionCardComponent } from '../../components/feed-components/suggestion-card/suggestion-card.component';
import { SuggestionSkeltonComponent } from '../../../shared/components/suggestion-skelton/suggestion-skelton.component';
import { Subject, takeUntil } from 'rxjs';
import { InternetConnectionComponent } from '../../../shared/components/internet-connection/internet-connection.component';
import { ErrorComponent } from '../../../shared/components/error/error.component';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css'],
  imports: [
    SuggestionCardComponent,
    SuggestionSkeltonComponent,
    InternetConnectionComponent,
    ErrorComponent,
  ],
})
export class SuggestionsComponent implements OnInit, OnDestroy {
  counter: WritableSignal<number> = signal(1);
  suggestions: WritableSignal<Isuggest[]> = signal([]);
  offline: WritableSignal<boolean> = signal(false);
  error: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  isLoading_: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  constructor(
    private location: Location,
    private followSuggestionsService: FollowSuggestionsService,
  ) {}

  ngOnInit() {
    this.getMySuggestions();
  }
  back() {
    this.location.back();
  }
  getMySuggestions(limit: number = 1) {
    if (limit === 1) {
      this.isLoading.set(true);
    } else {
      this.isLoading_.set(true);
    }

    this.followSuggestionsService
      .getMoreFollowSuggestions(10 * limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Isuggest[]) => {
          this.isLoading.set(false);
          this.isLoading_.set(false);
          this.suggestions.set(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.isLoading_.set(false);
          this.suggestions.set([]);
          if (!navigator.onLine) {
            this.offline.set(true);
          } else {
            this.error.set(true);
          }
        },
      });
  }

  getMoreSuggestions() {
    this.counter.update((s) => (s += 1));
    this.getMySuggestions(this.counter());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
