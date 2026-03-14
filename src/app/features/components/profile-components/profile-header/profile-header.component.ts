import { FollowSuggestionsService } from './../../../services/follow-suggestions/follow-suggestions.service';
import { Component, Input, OnInit, signal } from '@angular/core';
import { IaccountUser } from '../../../models/account-user/Iaccount-user.js';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../../../core/layouts/components/loader/loader.component';
import { AuthService } from '../../../../core/auth/services/auth.service.js';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
  imports: [LoaderComponent],
})
export class ProfileHeaderComponent implements OnInit {
  @Input() accoutUser: IaccountUser | null = null;
  @Input() postsNum: number | null = null;
  otherUser: boolean;
  @Input() isFollowing: boolean | null = null;
  isLoading = signal<boolean>(false);
  constructor(
    private activatedRoute: ActivatedRoute,
    private followSuggestionsService: FollowSuggestionsService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.otherUser = false;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id && id !== this.authService.getUserData()?._id) {
        this.otherUser = true;
      }
    });
  }
  followUnfollowUser(userId: string) {
    this.isLoading.set(true);
    this.followSuggestionsService.followUnfollowUser(userId).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.isFollowing = !this.isFollowing;
        this.router.navigate([`/main/profile/${userId}`]);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }
}
