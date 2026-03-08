import { TimeService } from './../../../../core/services/time/time.service';
import { SweetAlertService } from './../../../../core/services/sweet-alert/sweet-alert.service';
import { PostsService } from './../../../services/posts/posts.service';
import { Location } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Icomment } from '../../../models/comments/Icomment.js';
import { Ipost } from '../../../models/posts/Ipost.js';
import { LoaderComponent } from '../../../../core/layouts/components/loader/loader.component';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { PostCommentsComponent } from '../post-comments/post-comments.component';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
  imports: [RouterLink, ContentLoaderComponent, PostCommentsComponent, LoaderComponent],
})
export class PostDetailsComponent implements OnInit {
  post = signal<Ipost | null>(null);
  isLodaing = signal<boolean>(false);
  showComments: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private loc: Location,
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private timeService: TimeService,
  ) {
    this.showComments = false;
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
        this.sweetAlertService.fireSwal('invalid post', 'error');
        this.router.navigate(['/404']);
      },
    });
  }

  fomatTime(data: string) {
    return this.timeService.timeAgoShort(data);
  }

  showPostComments() {
    this.showComments = !this.showComments;
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
}
