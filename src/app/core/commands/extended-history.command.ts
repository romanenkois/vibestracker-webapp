import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadingStatus, ExtendedStreamingHistory } from '@types';
import { UserExtandedDataStorage, UserStorage } from '@storage';
import { HttpClient } from '@angular/common/http';
import { $appConfig } from '@environments';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryCommand {
  private http: HttpClient = inject(HttpClient);
  private userStorage: UserStorage = inject(UserStorage);
  private userExtendedDataStorage: UserExtandedDataStorage = inject(
    UserExtandedDataStorage,
  );

  public uploadExtendedHistory(params: {
    history: ExtendedStreamingHistory[];
  }): Observable<UploadingStatus> {
    const jsonString = JSON.stringify(params.history);
    const sizeInMB = Number((jsonString.length / (1024 * 1024)).toFixed(2));
    console.log(`File size: ${sizeInMB} MB`);

    return new Observable<UploadingStatus>((observer) => {
      observer.next('uploading');

      this.http
        .post(`${$appConfig.api.BASE_API_URL}/extended-history`, {
          extendedHistrory: params.history,
        })
        .subscribe({
          next: (response: any) => {
            console.log('Response from upload:', response);
            console.log('12', response.user);
            this.userStorage.setUser(response.user);
            console.log('Upload successful:', response);
            observer.next('resolved');
            observer.complete();
          },
          error: (error: any) => {
            console.error('Error during upload:', error);
            observer.next('error');
            observer.complete();
          },
        });
    });
  }

  public loadExtendedHistory() {
    this.userExtendedDataStorage.userExtendedDataLoadingState.set('loading');

    if (this.userExtendedDataStorage.getUserExtendedData().length > 0) {
      this.userExtendedDataStorage.userExtendedDataLoadingState.set('resolved');
      return;
    }

    if (
      this.userStorage
        .getUser()
        ?.listeningData.find((item) => item.type === 'expanded-history') ===
      undefined
    ) {
      console.log('nothing to load');
      this.userExtendedDataStorage.userExtendedDataLoadingState.set(
        'nothing-to-load',
      );
      return;
    }

    const startingDate: Date = new Date(
      this.userStorage
        .getUser()
        ?.listeningData.find((item) => item.type === 'expanded-history')
        ?.startingDate || 0,
    );

    const endingDate: Date = new Date(
      this.userStorage
        .getUser()
        ?.listeningData.find((item) => item.type === 'expanded-history')
        ?.endingDate || Date.now(),
    );

    this.http
      .get<any>(
        `${$appConfig.api.BASE_API_URL}/extended-history?startingDate=${startingDate.toISOString()}&endingDate=${endingDate.toISOString()}`,
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.userExtendedHistory) {
            this.userExtendedDataStorage.setUserExtendedData(
              response.userExtendedHistory,
            );
            this.userExtendedDataStorage.userExtendedDataLoadingState.set(
              'all-resolved',
            );
          } else {
            console.error(response);
            this.userExtendedDataStorage.userExtendedDataLoadingState.set(
              'error',
            );
          }
        },
        error: (error: any) => {
          console.error('Error during load:', error);
          this.userExtendedDataStorage.userExtendedDataLoadingState.set(
            'error',
          );
        },
      });
  }

  public deleteUserExtendedHistory() {
    this.userExtendedDataStorage.deletingUserExtendedDataLoadingState.set(
      'loading',
    );

    this.http
      .delete(`${$appConfig.api.BASE_API_URL}/extended-history`)
      .subscribe({
        next: (response: any) => {
          if (response.user) {
            this.userStorage.setUser(response.user);
            this.userExtendedDataStorage.deletingUserExtendedDataLoadingState.set(
              'resolved',
            );
          } else {
            console.error(
              'Invalid response from delete extended history:',
              response,
            );
            this.userExtendedDataStorage.deletingUserExtendedDataLoadingState.set(
              'error',
            );
          }
        },
        error: (error: any) => {
          console.error('Error during delete extended history:', error);
          this.userExtendedDataStorage.deletingUserExtendedDataLoadingState.set(
            'error',
          );
        },
      });
  }
}
