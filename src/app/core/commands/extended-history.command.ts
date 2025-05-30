import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UploadingStatus,
  ExtendedStreamingHistory,
  LoadingState,
} from '@types';
import { UserApi } from '@api';
import { UserExtandedDataStorage, UserStorage } from '@storage';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryCommand {
  private userApi: UserApi = inject(UserApi);
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

      this.userApi
        .uploadUserExtendedHistory({
          history: params.history,
        })
        .subscribe({
          next: (response: any) => {
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

  public loadExtendedHistory(): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

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

      this.userApi
        .getUserExtendedHistory(startingDate, endingDate)
        .subscribe({
          next: (response: any) => {
            console.log('Load:', response);
            if (response && response.userExtendedHistory) {
              this.userExtendedDataStorage.setUserExtendedData(
                response.userExtendedHistory,
              );
              observer.next('resolved');
              observer.complete();
            } else {
              console.warn(response);
              observer.next('error');
              observer.complete();
            }
          },
          error: (error: any) => {
            console.error('Error during load:', error);
            observer.next('error');
            observer.complete();
          },
        });
    });
  }
}
