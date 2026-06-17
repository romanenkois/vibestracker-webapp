import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { $appConfig } from '@environments';
import { UserSettingsStorage } from '@storage';
import { LoadingStatusEnum, UserPrivate } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserStorage {
  private readonly userSettings: UserSettingsStorage = inject(UserSettingsStorage);

  public readonly userExtendedDataLoaded: WritableSignal<boolean> = signal(false);

  private readonly userToken: WritableSignal<string | null> = signal(null);

  private readonly user: WritableSignal<UserPrivate | null> = signal(null);
  public readonly userLoadingState = signal(LoadingStatusEnum.Idle);

  // token
  public setToken(token: string | null): void {
    this.userToken.set(token);
    // TODO: dangerously unsafe
    if (this.userSettings.getUserSettings().saveToken) {
      if (token === null) {
        localStorage.removeItem($appConfig.localeStorageKeys.userToken);
      } else {
        localStorage.setItem($appConfig.localeStorageKeys.userToken, JSON.stringify(token));
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
