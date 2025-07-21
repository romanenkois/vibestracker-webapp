import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UserSettingsStorage } from '@storage';
import { LoadingState, UserPrivate } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserStorage {
  private readonly userSettings: UserSettingsStorage = inject(UserSettingsStorage);

  public readonly userExtendedDataLoaded: WritableSignal<boolean> = signal(false);

  private readonly userToken: WritableSignal<string | null> = signal(null);
  public readonly userTokenLoadingState: WritableSignal<LoadingState> = signal('idle');

  private readonly user: WritableSignal<UserPrivate | null> = signal(null);
  public readonly userLoadingState: WritableSignal<LoadingState> = signal('idle');

  // token
  public setToken(token: string | null): void {
    this.userToken.set(token);
    // TODO: dangerously unsafe
    if (this.userSettings.getUserSettings().saveToken) {
      if (token === null) {
        localStorage.removeItem('userToken');
      } else {
        localStorage.setItem('userToken', JSON.stringify(token));
      }
    }
  }
  public getToken(): string | null {
    return this.userToken();
  }

  // user
  public setUser(user: UserPrivate | null) {
    this.user.set(user);
  }
  public getUser(): UserPrivate | null {
    return this.user();
  }
}
