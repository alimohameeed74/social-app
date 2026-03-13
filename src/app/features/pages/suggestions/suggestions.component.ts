import { FollowSuggestionsService } from './../../services/follow-suggestions/follow-suggestions.service';
import { Location } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component';
import { Isuggest } from '../../models/follow-suggestions/Isuggest.js';
import { count } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css'],
  imports: [LoaderComponent],
})
export class SuggestionsComponent implements OnInit {
  counter: number;
  isLoading = signal<boolean>(false);
  suggestions = signal<Isuggest[]>([]);
  constructor(
    private location: Location,
    private followSuggestionsService: FollowSuggestionsService,
    private router: Router,
  ) {
    this.counter = 1;
  }

  ngOnInit() {
    this.getMySuggestions();
  }
  back() {
    this.location.back();
  }
  getMySuggestions(limit: number = 1) {
    this.isLoading.set(true);

    this.followSuggestionsService.getMoreFollowSuggestions(10 * limit).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.suggestions.set(res?.data?.suggestions);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }

  getMoreSuggestions() {
    this.counter++;
    this.getMySuggestions(this.counter);
  }
  goToProfile(id: string) {
    this.router.navigate([`/main/profile/${id}`]);
  }
  followUser(userId: string) {
    this.followSuggestionsService.followUnfollowUser(userId).subscribe({
      next: (res: any) => {
        this.getMySuggestions(this.counter);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
