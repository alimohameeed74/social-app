import { Routes } from '@angular/router';
import { authGuard } from '../core/auth/guards/auth-guard.js';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full',
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/feed/feed.component').then((p) => p.FeedComponent),
    title: 'Main | Feed',
  },
  {
    path: 'posts/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/feed-components/post-details/post-details.component').then(
        (p) => p.PostDetailsComponent,
      ),
    title: 'Post Details',
  },
  {
    path: 'edit-posts/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/feed-components/edit-post/edit-post.component').then(
        (p) => p.EditPostComponent,
      ),
    title: 'Edit Post',
  },

  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then((p) => p.NotificationsComponent),
    title: 'Main | Notifications',
  },
  {
    path: 'suggestions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/suggestions/suggestions.component').then((p) => p.SuggestionsComponent),
    title: 'Main | Suggestions',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then((p) => p.ProfileComponent),
    title: 'Main | Profile',
  },
  {
    path: 'profile/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then((p) => p.ProfileComponent),
    title: 'Main | Profile',
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/change-password/change-password.component').then(
        (p) => p.ChangePasswordComponent,
      ),
    title: 'Change Password',
  },
];
