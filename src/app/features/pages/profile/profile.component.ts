import { ProfileService } from './../../services/my-profile/profile.service';
import { Component, OnInit, signal } from '@angular/core';
import { ProfileHeaderComponent } from '../../components/profile-components/profile-header/profile-header.component';
import { IaccountUser } from '../../models/account-user/Iaccount-user.js';
import { LoaderComponent } from '../../../core/layouts/components/loader/loader.component';
import { ProfilePostsComponent } from '../../components/profile-components/profile-posts/profile-posts.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ProfileHeaderComponent, LoaderComponent, ProfilePostsComponent],
})
export class ProfileComponent implements OnInit {
  isLoading = signal<boolean>(false);
  profileDetails: IaccountUser | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.getMyProfile();
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
}
