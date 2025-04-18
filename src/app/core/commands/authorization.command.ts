import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorage } from '@storage';
import { LoadingState } from '@types';
import { AuthorizationApi } from '@api';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationCommand {
  authorizationApi: AuthorizationApi = inject(AuthorizationApi);
  tokenStorage: TokenStorage = inject(TokenStorage);

  public codeLogIn(code: string): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

      this.authorizationApi.codeLogIn(code).subscribe({
        next: (response: any) => {
          this.tokenStorage.setToken(response.token);
          observer.next('resolved');
          observer.complete();
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
    this.tokenStorage.setToken(null);
    window.location.reload();
  }
}
