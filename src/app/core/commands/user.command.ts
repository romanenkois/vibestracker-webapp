import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorage } from '@storage';
import { LoadingState } from '@types';
import { UserApi } from '@api';

@Injectable({
  providedIn: 'root',
})
export class UserCommand {
  userApi: UserApi = inject(UserApi);
  userStorage: UserStorage = inject(UserStorage);

  public loadUser(): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

      this.userApi.getUserPrivate().subscribe({
        next: (response: any) => {
          if (response.user) {
            this.userStorage.setUser(response.user);
            observer.next('resolved');
            observer.complete();
          } else {
            console.error('Invalid response from user load:', response);
            observer.next('error');
            observer.complete();
          }
        },
        error: (error: any) => {
          console.error('Error during user load:', error);
          observer.next('error');
          observer.complete();
        },
      });
    });
  }
}
