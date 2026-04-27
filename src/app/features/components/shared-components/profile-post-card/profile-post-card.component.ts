import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { Ipost } from '../../../models/posts/Ipost';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../services/my-profile/profile.service';
import { TimeService } from '../../../../core/services/time/time.service';
import { SweetAlertService } from '../../../../core/services/sweet-alert/sweet-alert.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { TimeShortAgoPipe } from '../../../../shared/pipes/time-short-age/timeShortAgo.pipe';

@Component({
  selector: 'app-profile-post-card',
  templateUrl: './profile-post-card.component.html',
  styleUrls: ['./profile-post-card.component.css'],
  imports: [TimeShortAgoPipe],
})
export class ProfilePostCardComponent implements OnInit, OnChanges {
  post: InputSignal<Ipost> = input.required();
  otherUser: WritableSignal<boolean> = signal(false);
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private timeService: TimeService,
    private sweetAlertService: SweetAlertService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {}
  ngOnChanges(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id && id !== this.authService.getUserData()?._id) {
        this.otherUser.set(true);
      }
    });
  }
  goToPostDetails(id: string) {
    this.router.navigate([`/main/posts/${id}`]);
  }
  deletePost(id: string) {
    // this.isLoading.set(true);
    this.profileService.deletePost(id).subscribe({
      next: (res: any) => {
        // this.isLoading.set(false);
        this.sweetAlertService.fireSwal(res?.message, 'success');
        // this.getPosts();
      },
      error: (err) => {
        // this.isLoading.set(false);
        this.sweetAlertService.fireSwal(err?.message, 'error');
      },
    });
  }

  editPost(i: string) {}

  timeFormat(data: string) {
    return this.timeService.formatDate(data);
  }
  // goToPostDetails(id: string) {
  //   this.router.navigate([`/main/posts/${id}`]);
  // }
  // deletePost(id: string) {
  //   this.isLoading.set(true);
  //   this.profileService.deletePost(id).subscribe({
  //     next: (res: any) => {
  //       this.isLoading.set(false);
  //       this.sweetAlertService.fireSwal(res?.message, 'success');
  //       this.getPosts();
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.sweetAlertService.fireSwal(err?.message, 'error');
  //     },
  //   });
  // }
  // editPost(postId: string) {
  //   this.router.navigate([`/main/edit-posts/${postId}`]);
  // }
}
