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

  public addIgnoredTrack(trackId: Track['id']) {
    this._userStorage.userLoadingState.set(LoadingStatusEnum.Reloading);

    this._http
      .patch(`${$appConfig.api.BASE_API_URL}/user-ignore-track`, {
        trackId,
      })
      .subscribe({
        next: (response: any) => {
          if (response.user) {
            this._userStorage.setUser(response.user);
            this._userStorage.userLoadingState.set(LoadingStatusEnum.Resolved);
          } else {
            console.error('Invalid response from add ignored track:', response);
            this._userStorage.userLoadingState.set(LoadingStatusEnum.Resolved);
          }
        },
        error: (error: any) => {
          console.error('Error during add ignored track:', error);
          this._userStorage.userLoadingState.set(LoadingStatusEnum.Resolved);
        },
      });
  }

  public clearIgnoredTracks() {
    this._userStorage.userLoadingState.set(LoadingStatusEnum.Reloading);

    this._http.delete(`${$appConfig.api.BASE_API_URL}/user-ignored-tracks`).subscribe({
      next: (response: any) => {
        if (response.user) {
          this._userStorage.setUser(response.user);
          this._userStorage.userLoadingState.set(LoadingStatusEnum.Resolved);
        } else {
          console.error('Invalid response from clear ignored tracks:', response);
          this._userStorage.userLoadingState.set(LoadingStatusEnum.Resolved);
        }
      },
      error: (error: any) => {
        console.error('Error during clear ignored tracks:', error);
        this._userStorage.userLoadingState.set(LoadingStatusEnum.Resolved);
      },
    });
  }
}
