import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TokenStorage } from '@storage';
import { LoadingState } from '@types';
import { AuthorizationApi } from '@api';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  authorizationApi: AuthorizationApi = inject(AuthorizationApi);
  tokenStorage: TokenStorage = inject(TokenStorage);

  public codeLogIn(code: string): Observable<LoadingState> {
    return new Observable<LoadingState>(observer => {
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
        }
      });
    });
  }
}
