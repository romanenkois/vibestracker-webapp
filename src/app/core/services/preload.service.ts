import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AuthorizationCommand } from '@commands';
import { UserStorage, UserSettingsStorage } from '@storage';
import { LoadingState, PreloadUserLoginState } from '@types';

@Injectable({
  providedIn: 'root',
})
export class PreloadService {
  private readonly _userSettings = inject(UserSettingsStorage);
  private readonly _authorizationCommand = inject(AuthorizationCommand);
  private readonly _userStorage = inject(UserStorage);

  public preloadUserLoginStatus: WritableSignal<PreloadUserLoginState> = signal('idle');

  constructor() {
    this.verifyUserByToken();
  }

  public verifyUserByToken() {
    this.preloadUserLoginStatus.set('loading');
    let token = this._userStorage.getToken() || null;

    if (!token) {
      try {
        // we try to get token, at first from uptime time memory, then from local storage
        const _token = this._userSettings.getUserSettings().saveToken
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
    this._userStorage.setToken(token);

    if (token) {
      this._authorizationCommand.verifyToken(token).subscribe((status: LoadingState) => {
        if (status === 'resolved') {
          this.preloadUserLoginStatus.set('resolved');
          // nothing is happening if everything is ok
          // token is loaded, guard would not retrigger
        }
        if (status === 'error') {
          this.preloadUserLoginStatus.set('rejected');
          // if token is not valid, we set it to null
          // this would trigger the guard to redirect to login page
          this._userStorage.setUser(null);
          this._userStorage.setToken(null);
        }
      });
    }
  }
}
