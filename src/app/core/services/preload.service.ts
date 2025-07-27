import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AuthorizationCommand } from '@commands';
import { UserStorage, UserSettingsStorage } from '@storage';
import { LoadingState, PreloadUserLoginState } from '@types';

@Injectable({
  providedIn: 'root',
})
export class PreloadService {
  private userSettings: UserSettingsStorage = inject(UserSettingsStorage);
  private authorizationCommand: AuthorizationCommand = inject(AuthorizationCommand);
  private userStorage: UserStorage = inject(UserStorage);

  public preloadUserLoginStatus: WritableSignal<PreloadUserLoginState> = signal('idle');

  constructor() {
    this.verifyUserByToken();
  }

  public verifyUserByToken() {
    this.preloadUserLoginStatus.set('loading');
    let token = this.userStorage.getToken() || null;

    if (!token) {
      try {
        // we try to get token, at first from uptime time memory, then from local storage
        let _token = this.userSettings.getUserSettings().saveToken
          ? JSON.parse(localStorage.getItem('userToken') || 'null')
          : null;
        if (_token) {
          token = _token;
        }
      } catch (error) {
        console.error('Error parsing token from localStorage:', error);
      }
    }

    // we set it in advance, so the guard doesn't freak out
    this.userStorage.setToken(token);

    if (token) {
      this.authorizationCommand.verifyToken(token).subscribe((status: LoadingState) => {
        if (status === 'resolved') {
          this.preloadUserLoginStatus.set('resolved');
          // nothing is happening if everything is ok
          // token is loaded, guard would not retrigger
        }
        if (status === 'error') {
          this.preloadUserLoginStatus.set('rejected');
          // if token is not valid, we set it to null
          // this would trigger the guard to redirect to login page
          this.userStorage.setUser(null);
          this.userStorage.setToken(null);
        }
      });
    }
  }
}
