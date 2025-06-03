import { Routes } from '@angular/router';
import { authorizationGuard, extendedHistoryGuard } from '@guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/main/main.component'),
    canActivate: [authorizationGuard],
    children: [
      {
        path: '',
        redirectTo: '/top',
        pathMatch: 'full',
        // loadComponent: () => import('@pages/home/home.component'),
      },
      {
        path: 'top',
        loadComponent: () =>
          import('@pages/user-top-items/user-top-items.component'),
      },
      {
        path: 'extended-history',
        loadComponent: () =>
          import('@pages/extended-history/extended-history.component'),
        // canActivate: [extendedHistoryGuard],
      },
      {
        path: 'extended-history/upload',
        loadComponent: () =>
          import(
            '@pages/extended-history-upload/extended-history-upload.component'
          ),
      },
      {
        path: 'settings',
        loadComponent: () => import('@pages/settings/settings.component'),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component'),
    canActivate: [],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
