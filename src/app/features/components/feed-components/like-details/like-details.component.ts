import { Component, OnInit, signal } from '@angular/core';
import { PostsService } from '../../../services/posts/posts.service.js';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Iuser } from '../../../models/users/Iuser.js';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';

@Component({
  selector: 'app-like-details',
  templateUrl: './like-details.component.html',
  styleUrls: ['./like-details.component.css'],
  imports: [ContentLoaderComponent, RouterLink],
})
export class LikeDetailsComponent implements OnInit {
  likes = signal<Iuser[]>([]);
  likesLoading = signal<boolean>(false);
  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getPostLikes(id);
      }
    });
  }
  getPostLikes(postId: string) {
    this.postsService.getPostLikes(postId).subscribe({
      next: (res: any) => {
        this.likesLoading.set(true);
        this.likes.set(res?.data?.likes);
      },
      error: (err) => {
        this.likes.set([]);
        console.log(err);
      },
    });
  }
}
