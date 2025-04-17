import { Routes } from '@angular/router';
import { authorizationGuard } from '@guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/main/main.component'),
    canActivate: [authorizationGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('@pages/home/home.component'),
      },
      {
        path: 'top',
        loadComponent: () =>
          import('@pages/user-top-items/user-top-items.component'),
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
