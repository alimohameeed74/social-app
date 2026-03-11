import { ProfileService } from './../../services/my-profile/profile.service';
import { Component, OnInit, signal } from '@angular/core';
import { ProfileHeaderComponent } from '../../components/profile-components/profile-header/profile-header.component';
import { IaccountUser } from '../../models/account-user/Iaccount-user.js';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component';
import { ProfilePostsComponent } from '../../components/profile-components/profile-posts/profile-posts.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ProfileHeaderComponent, LoaderComponent, ProfilePostsComponent],
})
export class ProfileComponent implements OnInit {
  isLoading = signal<boolean>(false);
  profileDetails: IaccountUser | null = null;

  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (!id) {
        this.getMyProfile();
      } else {
        this.getUserProfile(id);
      }
    });
  }

  getMyProfile() {
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.profileDetails = res?.data?.user;
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }

  getUserProfile(userId: string) {
    this.profileService.getUserProfile(userId).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.profileDetails = res?.data?.user;
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }
}
