import { Component, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service.js';
import { Iuser } from '../../../../features/models/users/Iuser.js';
import { ProfileService } from '../../../../features/services/my-profile/profile.service.js';
import { NotificationsService } from '../../../../features/services/notifications/notifications.service.js';
import { BehaviorSubject, interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userDetails: WritableSignal<Iuser | null> = signal(null);
  toggler: WritableSignal<boolean> = signal(false);
  notificationsCount: WritableSignal<number> = signal(0);
  private destroy$ = new Subject<void>();
  interval$ = interval(30000);
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationsService: NotificationsService,
  ) {}
  ngOnInit(): void {
    this.userDetails.set(this.userData);

    this.interval$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getNotifications();
    });
  }
  toggle() {
    this.toggler.update((s) => !s);
  }
  goTo(link: string = '/') {
    if (link === '/') {
      this.authService.deleteUserData();
      this.authService.userLogout();
    }
    this.router.navigate([link]);
  }

  getNotifications() {
    this.notificationsService
      .getNotificationsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: number) => {
          this.notificationsCount.set(res);
        },
        error: (err) => {
          this.notificationsCount.set(0);
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  get userData() {
    return this.authService.getUserData();
  }
}
