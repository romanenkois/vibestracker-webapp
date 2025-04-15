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
    let token = this.tokenStorage.getToken();

    try {
      // we try to get token, at first from apprun time memory, then from local storage
      let _token = this.userSettings.getUserSettings().saveToken
        ? JSON.parse(localStorage.getItem('userToken') || 'null')
        : null;
      if (_token) {
        token = _token;
      }
    } catch (error) {
      console.error('Error parsing token from localStorage:', error);
      token = null;
    }

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
