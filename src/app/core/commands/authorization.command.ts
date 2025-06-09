import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorage } from '@storage';
import { LoadingState } from '@types';
import { $appConfig } from '@environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationCommand {
  private http: HttpClient = inject(HttpClient);
  private userStorage: UserStorage = inject(UserStorage);

  public codeLogIn(code: string): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

      this.http
        .get<any>(
          `${$appConfig.api.BASE_API_URL}/authorization/code?code=${code}`,
        )
        .subscribe({
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

      this.http
        .get<any>(`${$appConfig.api.BASE_API_URL}/authorization/verify`)
        .subscribe({
          next: (response: any) => {
            if (response.user && response.token) {
              this.userStorage.setUser(response.user);
              this.userStorage.setToken(response.token);
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
