import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  private readonly userToken: WritableSignal<string | null> = signal(null);

  public setToken(token: string) {
    this.userToken.set(token);
    // localStorage.setItem('userToken', token);
  }
  public getToken(): string | null {
    return this.userToken();
  }
}
