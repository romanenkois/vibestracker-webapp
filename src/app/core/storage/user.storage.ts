import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UserSettingsStorage } from '@storage';
import { UserPrivate } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserStorage {
  private userSettings: UserSettingsStorage = inject(UserSettingsStorage);

  private readonly userToken: WritableSignal<string | null> = signal(null);
  private readonly user: WritableSignal<UserPrivate | null> = signal(null);

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
