import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingStatusEnum, ExtendedStreamingHistoryPrepared, UploadingStatusEnum, DeletingStatusEnum } from '@types';
import { UserExtendedDataStorage, UserStorage } from '@storage';
import { HttpClient } from '@angular/common/http';
import { $appConfig } from '@environments';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryCommand {
  private http: HttpClient = inject(HttpClient);
  private userStorage: UserStorage = inject(UserStorage);
  private userExtendedDataStorage: UserExtendedDataStorage = inject(UserExtendedDataStorage);

  public uploadExtendedHistory(params: {
    history: ExtendedStreamingHistoryPrepared[];
  }): Observable<UploadingStatusEnum> {
    const jsonString = JSON.stringify(params.history);
    const sizeInMB = Number((jsonString.length / (1024 * 1024)).toFixed(2));
    console.log(`File size: ${sizeInMB} MB`);

    return new Observable<UploadingStatusEnum>((observer) => {
      observer.next(UploadingStatusEnum.Uploading);

      this.http
        .post(`${$appConfig.api.BASE_API_URL}/extended-history`, {
          extendedHistory: params.history,
        })
        .subscribe({
          next: (response: any) => {
            if (response && response.user) {
              this.userStorage.setUser(response.user);
              observer.next(UploadingStatusEnum.Resolved);
              observer.complete();
              return;
            } else {
              console.error('Invalid response from upload:', response);
              observer.next(UploadingStatusEnum.Error);
              observer.complete();
              return;
            }
          },
          error: (error) => {
            console.error('Error during upload:', error);
            observer.next(UploadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  public loadExtendedHistory(params: { startingDate: Date; endingDate: Date }): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      this.http
        .get<any>(
          `${$appConfig.api.BASE_API_URL}/extended-history?startingDate=${params.startingDate.toISOString()}&endingDate=${params.endingDate.toISOString()}`,
        )
        .subscribe({
          next: (response: any) => {
            if (response && response.userExtendedHistory) {
              this.userExtendedDataStorage.setUserExtendedData(response.userExtendedHistory);
              this.userStorage.userExtendedDataLoaded.set(true);
              observer.next(LoadingStatusEnum.Resolved);
              observer.complete();
              return;
            } else {
              this.userStorage.userExtendedDataLoaded.set(false);
              console.error(response);
              observer.next(LoadingStatusEnum.Error);
              observer.complete();
              return;
            }
          },
          error: (error) => {
            this.userStorage.userExtendedDataLoaded.set(false);
            console.error('Error during load:', error);
            observer.next(LoadingStatusEnum.Error);
            observer.complete();
            return;
          },
        });
    });
  }

  public deleteUserExtendedHistory(): Observable<DeletingStatusEnum> {
    return new Observable<DeletingStatusEnum>((observer) => {
      this.http.delete(`${$appConfig.api.BASE_API_URL}/extended-history`).subscribe({
        next: (response: any) => {
          if (response.user) {
            this.userStorage.setUser(response.user);
            observer.next(DeletingStatusEnum.Deleted);
            observer.complete();
          } else {
            console.error('Invalid response from delete extended history:', response);
            observer.next(DeletingStatusEnum.Error);
            observer.complete();
          }
        },
        error: (error) => {
          console.error('Error during delete extended history:', error);
          observer.next(DeletingStatusEnum.Error);
          observer.complete();
        },
      });
    });
  }
}
