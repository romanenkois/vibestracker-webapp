import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorage } from '@storage';
import { LoadingState, UserPrivate } from '@types';
import { AuthorizationApi } from '@api';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationCommand {
  authorizationApi: AuthorizationApi = inject(AuthorizationApi);
  userStorage: UserStorage = inject(UserStorage);

  public codeLogIn(code: string): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

      this.authorizationApi.codeLogIn(code).subscribe({
        next: (response: any) => {
          if (response.token && response.user) {
            this.userStorage.setToken(response.token);
            this.userStorage.setUser(response.user);

            observer.next('resolved');
            observer.complete();
          } else {
            console.error('Invalid response from login:', response);
            observer.next('error');
            observer.complete();
          }
        },
        error: (error: any) => {
          console.error('Error during login:', error);
          observer.next('error');
          observer.complete();
        },
      });
    });
  }

  public verifyToken(token: string): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');
      this.authorizationApi.verifyToken(token).subscribe({
        next: (response: any) => {
          if (response.message === 'Token is valid') {
            observer.next('resolved');
            observer.complete();
          } else {
            // is 401 if not valid, but we would handle anything else as error of authorization
            observer.next('error');
            observer.complete();
          }
        },
        error: (error: any) => {
          observer.next('error');
          observer.complete();
        },
      });
    });
  }

  public logOut(): void {
    this.userStorage.setToken(null);
    window.location.reload();
  }
}
