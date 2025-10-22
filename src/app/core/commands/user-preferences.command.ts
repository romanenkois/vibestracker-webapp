import { DestroyRef, inject, Injectable } from '@angular/core';
import { UserStorage } from '@storage';
import { ApiErrorResponse, Artist, DeletingStatusEnum, LoadingStatusEnum, Track, UploadingStatusEnum } from '@types';
import { HttpClient } from '@angular/common/http';
import { $appConfig } from '@environments';
import { ToastNotificationsService } from '@libs';
import { Observable } from 'rxjs';
import { UserPreferencesStorage } from '../storage/user-preferences.storage';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesCommand {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _toastNotificationsService: ToastNotificationsService = inject(ToastNotificationsService);
  private readonly _userPreferencesStorage = inject(UserPreferencesStorage);

  // #region User Ignored Tracks

  public loadUserIgnoredTracks(): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      this._http
        .get(`${$appConfig.api.BASE_API_URL}/user-ignored-tracks`)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: any) => {
            if (response?.ignoredTracks) {
              this._userPreferencesStorage.setUserIgnoredTracks(response.ignoredTracks);
              observer.next(LoadingStatusEnum.Resolved);
              observer.complete();
            } else {
              this._toastNotificationsService.sendNotification({
                type: 'error',
                title: 'Unknown Error loading ignored tracks',
              });
              observer.next(LoadingStatusEnum.Error);
              observer.complete();
            }
          },
          error: (error: ApiErrorResponse) => {
            console.log();
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Error loading ignored tracks',
              message: error?.error?.message || 'Unknown error',
            });
            observer.next(LoadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  public addIgnoredTrack(params: { trackId: Track['id'] }): Observable<UploadingStatusEnum> {
    return new Observable<UploadingStatusEnum>((observer) => {
      observer.next(UploadingStatusEnum.Uploading);
      this._http
        .post(`${$appConfig.api.BASE_API_URL}/user-ignore-track`, {
          trackId: params.trackId,
        })
        .subscribe({
          next: (response: any) => {
            if (response) {
              this._userPreferencesStorage.addUserIgnoredTrack(params.trackId);
            }
          },
          error: (error: ApiErrorResponse) => {
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Error ignoring track',
              message: error?.error?.message || 'Unknown error',
            });
            observer.next(UploadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  public removeIgnoredTrack(params: { trackId: Track['id'] }): Observable<DeletingStatusEnum> {
    return new Observable<DeletingStatusEnum>((observer) => {
      observer.next(DeletingStatusEnum.Deleting);
      this._http.delete(`${$appConfig.api.BASE_API_URL}/user-ignore-track/${params.trackId}`).subscribe({
        next: (response: any) => {
          if (response) {
            this._userPreferencesStorage.removeUserIgnoredTrack(params.trackId);
            observer.next(DeletingStatusEnum.Deleted);
            observer.complete();
          } else {
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Unknown Error removing ignored track',
            });
            observer.next(DeletingStatusEnum.Error);
            observer.complete();
          }
        },
        error: (error: ApiErrorResponse) => {
          this._toastNotificationsService.sendNotification({
            type: 'error',
            title: 'Error removing ignored track',
            message: error?.error?.message || 'Unknown error',
          });
          observer.next(DeletingStatusEnum.Error);
          observer.complete();
        },
      });
    });
  }

  public clearIgnoredTracks(): Observable<DeletingStatusEnum> {
    return new Observable<DeletingStatusEnum>((observer) => {
      observer.next(DeletingStatusEnum.Deleting);

      this._http.delete(`${$appConfig.api.BASE_API_URL}/user-ignored-tracks`).subscribe({
        next: (response) => {
          if (response) {
            this._userPreferencesStorage.setUserIgnoredTracks([]);
            observer.next(DeletingStatusEnum.Deleted);
            observer.complete();
          } else {
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Unknown Error clearing ignored tracks',
            });
            observer.next(DeletingStatusEnum.Error);
            observer.complete();
          }
        },
        error: (error: ApiErrorResponse) => {
          this._toastNotificationsService.sendNotification({
            type: 'error',
            title: 'Error clearing ignored tracks',
            message: error?.error?.message || 'Unknown error',
          });
          observer.next(DeletingStatusEnum.Error);
          observer.complete();
        },
      });
    });
  }

  // #endregion User Ignored Tracks

  // #region User Ignored Artists

  public loadUserIgnoredArtists(): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      this._http
        .get(`${$appConfig.api.BASE_API_URL}/user-ignored-artists`)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: any) => {
            if (response?.ignoredArtists) {
              this._userPreferencesStorage.setUserIgnoredArtists(response.ignoredArtists);
              observer.next(LoadingStatusEnum.Resolved);
              observer.complete();
            } else {
              this._toastNotificationsService.sendNotification({
                type: 'error',
                title: 'Unknown Error loading ignored artists',
              });
              observer.next(LoadingStatusEnum.Error);
              observer.complete();
            }
          },
          error: (error: ApiErrorResponse) => {
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Error loading ignored artists',
              message: error?.error?.message || 'Unknown error',
            });
            observer.next(LoadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  public addIgnoredArtist(params: { artistId: Artist['id'] }): Observable<UploadingStatusEnum> {
    return new Observable<UploadingStatusEnum>((observer) => {
      observer.next(UploadingStatusEnum.Uploading);

      this._http
        .post(`${$appConfig.api.BASE_API_URL}/user-ignore-artist`, {
          artistId: params.artistId,
        })
        .subscribe({
          next: (response) => {
            if (response) {
              this._userPreferencesStorage.addUserIgnoredArtist(params.artistId);
              observer.next(UploadingStatusEnum.Resolved);
              observer.complete();
            } else {
              this._toastNotificationsService.sendNotification({
                type: 'error',
                title: 'Unknown Error ignoring artist',
              });
              observer.next(UploadingStatusEnum.Error);
              observer.complete();
            }
          },
          error: (error: ApiErrorResponse) => {
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Error ignoring artist',
              message: error?.error?.message || 'Unknown error',
            });
            observer.next(UploadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  public removeIgnoredArtist(params: { artistId: Artist['id'] }): Observable<DeletingStatusEnum> {
    return new Observable<DeletingStatusEnum>((observer) => {
      observer.next(DeletingStatusEnum.Deleting);

      this._http.delete(`${$appConfig.api.BASE_API_URL}/user-ignore-artist/${params.artistId}`).subscribe({
        next: (response) => {
          if (response) {
            this._userPreferencesStorage.removeUserIgnoredArtist(params.artistId);
            observer.next(DeletingStatusEnum.Deleted);
            observer.complete();
          } else {
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Unknown Error removing ignored artist',
            });
            observer.next(DeletingStatusEnum.Error);
            observer.complete();
          }
        },
        error: (error: ApiErrorResponse) => {
          this._toastNotificationsService.sendNotification({
            type: 'error',
            title: 'Error removing ignored artist',
            message: error?.error?.message || 'Unknown error',
          });
          observer.next(DeletingStatusEnum.Error);
          observer.complete();
        },
      });
    });
  }

  public clearIgnoredArtists(): Observable<DeletingStatusEnum> {
    return new Observable<DeletingStatusEnum>((observer) => {
      observer.next(DeletingStatusEnum.Deleting);

      this._http.delete(`${$appConfig.api.BASE_API_URL}/user-ignored-artists`).subscribe({
        next: (response) => {
          if (response) {
            this._userPreferencesStorage.setUserIgnoredArtists([]);
            observer.next(DeletingStatusEnum.Deleted);
            observer.complete();
          } else {
            this._toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Unknown Error clearing ignored artists',
            });
            observer.next(DeletingStatusEnum.Error);
            observer.complete();
          }
        },
        error: (error: ApiErrorResponse) => {
          this._toastNotificationsService.sendNotification({
            type: 'error',
            title: 'Error clearing ignored artists',
            message: error?.error?.message || 'Unknown error',
          });
          observer.next(DeletingStatusEnum.Error);
          observer.complete();
        },
      });
    });
  }

  // #endregion User Ignored Artists
}
