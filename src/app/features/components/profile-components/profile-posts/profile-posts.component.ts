import { SweetAlertService } from './../../../../core/services/sweet-alert/sweet-alert.service';
import { Component, Input, OnInit, Output, signal } from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { TimeService } from '../../../../core/services/time/time.service.js';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { ProfileService } from '../../../services/my-profile/profile.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../../../core/layouts/components/loader/loader.component';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css'],
  imports: [ContentLoaderComponent, LoaderComponent],
})
export class ProfilePostsComponent implements OnInit {
  posts = signal<Ipost[]>([]);
  isLoading = signal<boolean>(false);
  otherUser: boolean;
  constructor(
    private profileService: ProfileService,
    private timeService: TimeService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.otherUser = false;
  }

  ngOnInit() {
    this.posts.set([]);
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (!id) {
        this.getPosts();
      } else {
        this.otherUser = true;
        this.getUserPosts(id);
      }
    });
  }

  getPosts() {
    this.profileService.getMyposts().subscribe({
      next: (res: any) => {
        this.posts.set(res?.data?.posts);
      },
      error: (err) => {
        this.posts.set([]);
        console.log(err);
      },
    });
  }

  getUserPosts(id: string) {
    this.profileService.getUserposts(id).subscribe({
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
    return this.timeService.formatDate(data);
  }
  goToPostDetails(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }
  deletePost(id: string) {
    this.isLoading.set(true);
    this.profileService.deletePost(id).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.sweetAlertService.fireSwal(res?.message, 'success');
        this.getPosts();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.sweetAlertService.fireSwal(err?.message, 'error');
      },
    });
  }
  editPost(postId: string) {}
}
