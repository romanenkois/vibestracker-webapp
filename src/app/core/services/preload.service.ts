import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationCommand } from '@commands';
import { TokenStorage, UserSettingsStorage } from '@storage';
import { LoadingState } from '@types';

@Injectable({
  providedIn: 'root',
})
export class PreloadService {
  private router: Router = inject(Router);

  private userSettings: UserSettingsStorage = inject(UserSettingsStorage);
  private authorizationCommand: AuthorizationCommand =
    inject(AuthorizationCommand);
  private tokenStorage: TokenStorage = inject(TokenStorage);

  // this service always triggers on app load, so we send request to api to check if token is still valid
  constructor() {
    // we try to get token, at first from apprun time memmory, then from local storage
    const token =
      this.tokenStorage.getToken() ||
      this.userSettings.getUserSettings().saveToken
        ? JSON.parse(localStorage.getItem('userToken') || '')
        : null;

    if (token) {
      this.authorizationCommand
        .verifyToken(token)
        .subscribe((status: LoadingState) => {
          if (status === 'resolved') {
            this.tokenStorage.setToken(token);
            this.router.navigate(['/']);
          }
          if (status === 'error') {
            // this should trigger the guard to redirect to login page
            this.tokenStorage.setToken(null);
          }
        });
    }
  }
}
