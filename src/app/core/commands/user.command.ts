import { inject, Injectable } from '@angular/core';
import { UserStorage } from '@storage';
import { LoadingStatusEnum, Track } from '@types';
import { HttpClient } from '@angular/common/http';
import { $appConfig } from '@environments';
import { ToastNotificationsService } from '@libs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserCommand {
  private _http: HttpClient = inject(HttpClient);

  private _toastNotificationsService: ToastNotificationsService = inject(ToastNotificationsService);
  private _userStorage: UserStorage = inject(UserStorage);

  public loadUser(): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      this._http.get(`${$appConfig.api.BASE_API_URL}/user-private`).subscribe({
        next: (response: any) => {
          if (response.user) {
            this._userStorage.setUser(response.user);
            this._userStorage.userLoadingState.set(LoadingStatusEnum.Resolved);
          } else {
            console.error('Invalid response from user load:', response);
            this._userStorage.userLoadingState.set(LoadingStatusEnum.Error);
          }
        },
        error: (error: any) => {
          console.error('Error during user load:', error);
          this._toastNotificationsService.sendNotification({
            type: 'error',
            title: 'Error loading user data',
            message: error?.error || 'Unknown error',
          });
          observer.next(LoadingStatusEnum.Error);
          observer.complete();
        },
      });
    });
  }
}
