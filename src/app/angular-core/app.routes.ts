import { Routes } from '@angular/router';
import { authorizationGuard } from '@guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@modules/main-app/main-page/main.component'),
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
          import('@modules/main-app/pages/user-top-items/user-top-items.component'),
      },
      {
        path: 'extended-history',
        loadComponent: () =>
          import('@modules/main-app/pages/extended-history/extended-history.component'),
      },
      {
        path: 'extended-history/upload',
        loadComponent: () =>
          import(
            '@modules/main-app/pages/extended-history-upload/extended-history-upload.component'
          ),
      },
      {
        path: 'settings',
        loadComponent: () => import('@modules/main-app/pages/settings/settings.component'),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('@modules/login/login-page/login.component'),
    canActivate: [],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
