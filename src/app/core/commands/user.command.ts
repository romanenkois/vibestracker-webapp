import { inject, Injectable } from '@angular/core';
import { UserStorage } from '@storage';
import { LoadingState, Track } from '@types';
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

  public loadUser(): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

      this._http.get(`${$appConfig.api.BASE_API_URL}/user-private`).subscribe({
        next: (response: any) => {
          if (response.user) {
            this._userStorage.setUser(response.user);
            this._userStorage.userLoadingState.set('resolved');
          } else {
            console.error('Invalid response from user load:', response);
            this._userStorage.userLoadingState.set('error');
          }
        },
        error: (error: any) => {
          console.error('Error during user load:', error);
          this._toastNotificationsService.sendNotification({
            type: 'error',
            title: 'Error loading user data',
            message: error?.error || 'Unknown error',
          });
          observer.next('error');
          observer.complete();
        },
      });
    });
  }

  public addIgnoredTrack(trackId: Track['id']) {
    this._userStorage.userLoadingState.set('reloading');

    this._http
      .patch(`${$appConfig.api.BASE_API_URL}/user-ignore-track`, {
        trackId,
      })
      .subscribe({
        next: (response: any) => {
          if (response.user) {
            this._userStorage.setUser(response.user);
            this._userStorage.userLoadingState.set('resolved');
          } else {
            console.error('Invalid response from add ignored track:', response);
            this._userStorage.userLoadingState.set('resolved');
          }
        },
        error: (error: any) => {
          console.error('Error during add ignored track:', error);
          this._userStorage.userLoadingState.set('resolved');
        },
      });
  }

  public clearIgnoredTracks() {
    this._userStorage.userLoadingState.set('reloading');

    this._http.delete(`${$appConfig.api.BASE_API_URL}/user-ignored-tracks`).subscribe({
      next: (response: any) => {
        if (response.user) {
          this._userStorage.setUser(response.user);
          this._userStorage.userLoadingState.set('resolved');
        } else {
          console.error('Invalid response from clear ignored tracks:', response);
          this._userStorage.userLoadingState.set('resolved');
        }
      },
      error: (error: any) => {
        console.error('Error during clear ignored tracks:', error);
        this._userStorage.userLoadingState.set('resolved');
      },
    });
  }
}
