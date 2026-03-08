import { TimeService } from './../../../../core/services/time/time.service';
import { Component, Input, OnInit, signal } from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { PostsService } from '../../../services/posts/posts.service.js';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts-cards',
  templateUrl: './posts-cards.component.html',
  styleUrls: ['./posts-cards.component.css'],
  imports: [ContentLoaderComponent],
})
export class PostsCardsComponent implements OnInit {
  @Input() post: string = '';
  posts = signal<Ipost[]>([]);
  constructor(
    private postService: PostsService,
    private timeService: TimeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.posts.set([]);
  }
  ngOnChanges(): void {
    this.getPosts();
  }

  getPosts() {
    this.postService.getAllPosts().subscribe({
      next: (res: any) => {
        this.posts.set(res?.data?.posts);
      },
      error: (err) => {
        this.posts.set([]);
        console.log(err);
      },
    });
  }
  timeFormat(data: string) {
    return this.timeService.timeAgoShort(data);
  }
  goToPostComments(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }
}
