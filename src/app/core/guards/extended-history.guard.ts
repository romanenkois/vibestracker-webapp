import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorage } from '@storage';

export const extendedHistoryGuard: CanActivateFn = (route, state) => {
  const userStorage: UserStorage = inject(UserStorage);
  const router: Router = inject(Router);

  console.log('Authorization guard triggered');
  if (
    !userStorage.getUser() ||

    // checks, if user has uploaded expanded history data
    !userStorage
      .getUser()
      ?.listeningData.some((data) => data.type === 'expanded-history')
  ) {
    router.navigate(['/extended-history/upload']);
    return false;
  }
  return true;
};
