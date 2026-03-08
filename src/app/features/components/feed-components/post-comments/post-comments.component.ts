import { Component, OnInit, signal } from '@angular/core';
import { PostsService } from '../../../services/posts/posts.service.js';
import { Icomment } from '../../../models/comments/Icomment.js';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service.js';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { ActivatedRoute } from '@angular/router';
import { TimeService } from '../../../../core/services/time/time.service.js';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css'],
  imports: [ContentLoaderComponent],
})
export class PostCommentsComponent implements OnInit {
  comments = signal<Icomment[]>([]);

  constructor(
    private postsService: PostsService,
    private sweetAlertService: SweetAlertService,
    private activatedRoute: ActivatedRoute,
    private timeService: TimeService,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getComments(id);
      }
    });
  }
  getComments(id: string) {
    this.postsService.getPostComments(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.comments.set(res?.data?.comments);
      },
      error: (err) => {
        this.sweetAlertService.fireSwal(err?.message, 'error');
        // this.router.navigate(['/404']);
      },
    });
  }

  fomatTime(data: string) {
    return this.timeService.timeAgoShort(data);
  }
}
