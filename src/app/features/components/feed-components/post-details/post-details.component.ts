import { CommentsService } from './../../../services/comments/comments.service';
import { TimeService } from './../../../../core/services/time/time.service';
import { SweetAlertService } from './../../../../core/services/sweet-alert/sweet-alert.service';
import { PostsService } from './../../../services/posts/posts.service';
import { Location } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Ipost } from '../../../models/posts/Ipost.js';
import { LoaderComponent } from '../../../../core/layouts/components/loader/loader.component';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { ProfileService } from '../../../services/my-profile/profile.service.js';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { LikeDetailsComponent } from '../like-details/like-details.component';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
  imports: [
    RouterLink,
    ContentLoaderComponent,
    PostCommentsComponent,
    LoaderComponent,
    LikeDetailsComponent,
  ],
})
export class PostDetailsComponent implements OnInit {
  post = signal<Ipost | null>(null);
  isLodaing = signal<boolean>(false);
  contentLoading = signal<boolean>(false);
  showComments: boolean;
  showLikes: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private loc: Location,
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private profileService: ProfileService,
    private timeService: TimeService,
  ) {
    this.showComments = false;
    this.showLikes = false;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getPostDetails(id);
      }
    });
  }
  back() {
    this.loc.back();
  }

  getPostDetails(id: string) {
    this.postsService.getPostDetails(id).subscribe({
      next: (res: any) => {
        this.post.set(res?.data?.post);
      },
      error: (err) => {
        this.contentLoading.set(true);
        this.sweetAlertService.fireSwal('post not found', 'error');
      },
    });
  }

  fomatTime(data: string) {
    return this.timeService.timeAgoShort(data);
  }

  showPostComments() {
    this.showComments = !this.showComments;
  }
  showPostLikes() {
    this.showLikes = !this.showLikes;
  }
  toggleSavePost(id: string) {
    this.isLodaing.set(true);
    this.postsService.togglePost(id).subscribe({
      next: (res: any) => {
        this.isLodaing.set(false);
        this.getPostDetails(id);
      },
      error: (err) => {
        this.isLodaing.set(false);
        console.log(err);
      },
    });
  }
  deletePost(id: string) {
    this.isLodaing.set(true);
    this.profileService.deletePost(id).subscribe({
      next: (res: any) => {
        this.isLodaing.set(false);
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.router.navigate(['/main']);
      },
      error: (err) => {
        this.isLodaing.set(false);
        this.sweetAlertService.fireSwal(err?.message, 'error');
      },
    });
  }
  likeUnlikePost(id: string) {
    this.postsService.likeUnlikePost(id).subscribe({
      next: (res: any) => {
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.getPostDetails(id);
      },
      error: (err) => {
        this.sweetAlertService.fireSwal(err?.message, 'error');
      },
    });
  }
}
