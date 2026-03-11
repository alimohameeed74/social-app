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
    path: 'posts/:id',
    loadComponent: () =>
      import('./components/feed-components/post-details/post-details.component').then(
        (p) => p.PostDetailsComponent,
      ),
    title: 'Post Details',
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then((p) => p.NotificationsComponent),
    title: 'Main | Notifications',
  },
  {
    path: 'suggestions',
    loadComponent: () =>
      import('./pages/suggestions/suggestions.component').then((p) => p.SuggestionsComponent),
    title: 'Main | Suggestions',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((p) => p.ProfileComponent),
    title: 'Main | Profile',
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((p) => p.ProfileComponent),
    title: 'Main | Profile',
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./pages/change-password/change-password.component').then(
        (p) => p.ChangePasswordComponent,
      ),
    title: 'Change Password',
  },
];
