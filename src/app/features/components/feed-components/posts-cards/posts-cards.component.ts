import { SweetAlertService } from './../../../../core/services/sweet-alert/sweet-alert.service';
import { TimeService } from './../../../../core/services/time/time.service';
import { Component, Input, OnInit, signal } from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { PostsService } from '../../../services/posts/posts.service.js';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../../core/layouts/components/loader/loader.component';

@Component({
  selector: 'app-posts-cards',
  templateUrl: './posts-cards.component.html',
  styleUrls: ['./posts-cards.component.css'],
  imports: [ContentLoaderComponent, LoaderComponent, RouterLink],
})
export class PostsCardsComponent implements OnInit {
  @Input() post: string = '';
  posts = signal<Ipost[]>([]);
  isLodaing = signal<boolean>(false);
  isLiked: boolean = false;
  constructor(
    private postsService: PostsService,
    private timeService: TimeService,
    private router: Router,
    private sweetAlertService: SweetAlertService,
  ) {}

  ngOnInit() {
    this.posts.set([]);
  }
  ngOnChanges(): void {
    this.getPosts();
  }

  getPosts() {
    this.postsService.getAllPosts().subscribe({
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
  toggleSavePost(id: string) {
    this.isLodaing.set(true);
    this.postsService.togglePost(id).subscribe({
      next: (res: any) => {
        this.isLodaing.set(false);
        this.getPosts();
      },
      error: (err) => {
        this.isLodaing.set(false);
        console.log(err);
      },
    });
  }
  likeUnlikePost(id: string) {
    this.postsService.likeUnlikePost(id).subscribe({
      next: (res: any) => {
        this.isLiked = true;
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.getPosts();
      },
      error: (err) => {
        this.sweetAlertService.fireSwal(err?.message, 'error');
      },
    });
  }
}
