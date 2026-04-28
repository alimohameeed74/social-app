import {
  Component,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Isuggest } from '../../../models/follow-suggestions/Isuggest.js';
import { Router } from '@angular/router';
import { FollowSuggestionsService } from '../../../services/follow-suggestions/follow-suggestions.service.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-suggestion-card',
  templateUrl: './suggestion-card.component.html',
  styleUrls: ['./suggestion-card.component.css'],
})
export class SuggestionCardComponent implements OnInit, OnDestroy {
  suggestion: InputSignal<Isuggest> = input.required();
  isLoading: WritableSignal<boolean> = signal(false);
  isFollowing: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private followSuggestionsService: FollowSuggestionsService,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {}

  goToProfile(id: string) {
    this.router.navigate([`/main/profile/${id}`]);
  }
  followUser(userId: string) {
    this.isLoading.set(true);
    this.followSuggestionsService
      .followUnfollowUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.isFollowing.update((s) => !s);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (!navigator.onLine) {
            this.sweetAlertService.fireSwal('No Internet', 'error');
          } else {
            this.sweetAlertService.fireSwal(err?.message, 'error');
          }
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
