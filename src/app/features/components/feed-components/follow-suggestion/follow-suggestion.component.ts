import { Router } from '@angular/router';
import { Isuggest } from '../../../models/follow-suggestions/Isuggest.js';
import { FollowSuggestionsService } from './../../../services/follow-suggestions/follow-suggestions.service';
import { Component, OnInit, signal } from '@angular/core';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';

@Component({
  selector: 'app-follow-suggestion',
  templateUrl: './follow-suggestion.component.html',
  styleUrls: ['./follow-suggestion.component.css'],
  imports: [ContentLoaderComponent],
})
export class FollowSuggestionComponent implements OnInit {
  suggestions = signal<Isuggest[]>([]);

  constructor(
    private followSuggestionsService: FollowSuggestionsService,
    private router: Router,
  ) {
    this.suggestions.set([]);
  }

  ngOnInit() {
    this.getMyFollowSuggestions();
  }
  getMyFollowSuggestions() {
    this.followSuggestionsService.getFollowSuggestions().subscribe({
      next: (res: any) => {
        this.suggestions.set(res?.data?.suggestions);
      },
      error: (err) => {
        console.log(err);
        this.suggestions.set([]);
      },
    });
  }
  goToSuggestions() {
    this.router.navigate(['/main/suggestions']);
  }
  goToProfile(id: string) {
    this.router.navigate([`/main/profile/${id}`]);
  }
}
