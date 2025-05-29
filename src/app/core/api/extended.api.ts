import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { $appConfig } from '@environments';
import { ExtendedStreamingHistoryDTO } from '@types';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = $appConfig.api.BASE_API_URL;

  public uploadUserExtendedHistory(params: {
    history: ExtendedStreamingHistoryDTO[];
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/user/upload/extended-history`;
    const body = {
      extendedHistrory: params.history,
    };

    return this.http.post(endpoint, body);
  }
}
