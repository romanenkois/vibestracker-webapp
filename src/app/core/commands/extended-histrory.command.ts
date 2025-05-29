import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { TokenStorage } from '@storage';
import { LoadingState, UploadingStatus } from '@types';
import { ExtendedHistoryApi } from '@api';
import { ExtendedStreamingHistoryDTO } from 'src/app/shared/types/spotify/extended-streaming-history.dto';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryCommand {
  private extendedHistoryApi: ExtendedHistoryApi = inject(ExtendedHistoryApi);

  public uploadExtendedHistory(params: {
    history: ExtendedStreamingHistoryDTO[];
  }): Observable<UploadingStatus> {
    const jsonString = JSON.stringify(params.history);
    const sizeInMB = Number((jsonString.length / (1024 * 1024)).toFixed(2));
    console.log(`File size: ${sizeInMB} MB`);

    return new Observable<UploadingStatus>((observer) => {
      observer.next('uploading');

      this.extendedHistoryApi
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
