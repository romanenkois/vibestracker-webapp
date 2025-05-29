import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadingStatus, ExtendedStreamingHistoryDTO } from '@types';
import { UserApi } from '@api';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryCommand {
  private userApi: UserApi = inject(UserApi);

  public uploadExtendedHistory(params: {
    history: ExtendedStreamingHistoryDTO[];
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
}
