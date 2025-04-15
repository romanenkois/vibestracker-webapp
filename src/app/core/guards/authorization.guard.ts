import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorage } from '@storage';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const tokenStorage: TokenStorage = inject(TokenStorage);
  const router: Router = inject(Router);

  console.log('Authorization guard triggered');
  if (!tokenStorage.getToken()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
