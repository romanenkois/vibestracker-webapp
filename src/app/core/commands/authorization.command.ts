import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorage } from '@storage';
import { LoadingStatusEnum } from '@types';
import { $appConfig } from '@environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationCommand {
  private http: HttpClient = inject(HttpClient);
  private userStorage: UserStorage = inject(UserStorage);

  public codeLogIn(code: string): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      this.http
        .get<any>(
          `${$appConfig.api.BASE_API_URL}/authorization/code?code=${code}`,
        )
        .subscribe({
          next: (response: any) => {
            if (response.token && response.user) {
              this.userStorage.setToken(response.token);
              this.userStorage.setUser(response.user);

              observer.next(LoadingStatusEnum.Resolved);
              observer.complete();
            } else {
              console.error('Invalid response from login:', response);
              observer.next(LoadingStatusEnum.Error);
              observer.complete();
            }
          },
          error: (error: any) => {
            console.error('Error during login:', error);
            observer.next(LoadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  public verifyToken(token: string): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      this.http
        .get<any>(`${$appConfig.api.BASE_API_URL}/authorization/verify`)
        .subscribe({
          next: (response: any) => {
            if (response.user && response.token) {
              this.userStorage.setUser(response.user);
              this.userStorage.setToken(response.token);
              observer.next(LoadingStatusEnum.Resolved);
              observer.complete();
            } else {
              // is 401 if not valid, but we would handle anything else as error of authorization
              observer.next(LoadingStatusEnum.Error);
              observer.complete();
            }
          },
          error: (error: any) => {
            observer.next(LoadingStatusEnum.Error);
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
