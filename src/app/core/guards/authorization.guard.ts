import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorage } from '@storage';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const tokenStorage: TokenStorage = inject(TokenStorage);

  if (!tokenStorage.getToken()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
