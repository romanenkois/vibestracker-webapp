import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorage } from '@storage';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const userStorage: UserStorage = inject(UserStorage);
  const router: Router = inject(Router);

  console.log('Authorization guard triggered');
  if (!userStorage.getToken()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
