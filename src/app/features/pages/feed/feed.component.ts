import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CreatePostComponent } from '../../components/feed-components/create-post/create-post.component';
import { PostsCardsComponent } from '../../components/feed-components/posts-cards/posts-cards.component.js';
import { FollowSuggestionComponent } from '../../components/feed-components/follow-suggestion/follow-suggestion.component';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  imports: [CreatePostComponent, PostsCardsComponent, FollowSuggestionComponent],
})
export class FeedComponent implements OnInit {
  postStatus: WritableSignal<string> = signal('');
  constructor() {}
  ngOnInit(): void {}
  showPost(data: string) {
    this.postStatus.set(data);
  }
}
