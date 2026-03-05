import { Component, Input, OnInit, Output, signal } from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost.js';
import { TimeService } from '../../../../core/services/time/time.service.js';
import { ContentLoaderComponent } from '../../../../core/layouts/components/content-loader/content-loader.component';
import { ProfileService } from '../../../services/my-profile/profile.service.js';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css'],
  imports: [ContentLoaderComponent],
})
export class ProfilePostsComponent implements OnInit {
  posts = signal<Ipost[]>([]);
  constructor(
    private profileService: ProfileService,
    private timeService: TimeService,
  ) {}

  ngOnInit() {
    this.posts.set([]);
    this.getPosts();
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
  timeFormat(data: string) {
    return this.timeService.formatDate(data);
  }
}
