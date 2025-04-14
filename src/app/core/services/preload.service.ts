import { inject, Injectable } from '@angular/core';
import { AuthorizationCommand } from '@commands';
import { TokenStorage } from '@storage';
import { LoadingState } from '@types';

@Injectable({
  providedIn: 'root',
})
export class PreloadService {
  private authorizationCommand: AuthorizationCommand =
    inject(AuthorizationCommand);
  private tokenStorage: TokenStorage = inject(TokenStorage);

  // this service always triggers on app load, so we send request to api to check if token is still valid
  constructor() {
    const token = this.tokenStorage.getToken();
    if (token) {
      this.authorizationCommand
        .verifyToken(token)
        .subscribe((status: LoadingState) => {
          if (status === 'error') {
            this.tokenStorage.setToken(null);
          }
        });
    }
  }
}
