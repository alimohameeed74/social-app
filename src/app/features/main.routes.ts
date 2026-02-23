import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full',
  },
  {
    path: 'feed',
    loadComponent: () => import('./pages/feed/feed.component').then((p) => p.FeedComponent),
    title: 'Main | Feed',
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then((p) => p.NotificationsComponent),
    title: 'Main | Notifications',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((p) => p.ProfileComponent),
    title: 'Main | Profile',
  },
];
