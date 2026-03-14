import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbit/flowbit.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service.js';
import { Iuser } from '../../../../features/models/users/Iuser.js';
import { ProfileService } from '../../../../features/services/my-profile/profile.service.js';
import { NotificationsService } from '../../../../features/services/notifications/notifications.service.js';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userDetails = signal<Iuser | null>(null);
  toggler: boolean;
  notificationsCount = signal<number>(0);
  interval: any;
  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private notificationsService: NotificationsService,
  ) {
    this.userDetails.set(null);
    this.toggler = false;
  }
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.userDetails.set(this.authService.getUserData());
    this.getNotifications();
    this.interval = setInterval(() => {
      this.getNotifications();
    }, 10000);
  }
  toggle() {
    this.toggler = !this.toggler;
  }
  goTo(link: string = '/') {
    if (link === '/') {
      localStorage.removeItem('token');
      this.authService.deleteUserData();
    }
    this.router.navigate([link]);
  }

  getNotifications() {
    this.notificationsService.getNotificationsCount().subscribe({
      next: (res: any) => {
        const count = res?.data?.unreadCount;
        if (this.notificationsCount() !== count) {
          this.notificationsCount.set(res?.data?.unreadCount);
        }
      },
      error: (err) => {
        this.notificationsCount.set(0);
        console.log(err);
      },
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
