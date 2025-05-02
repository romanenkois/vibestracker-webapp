import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { $appConfig } from '@environments';
import { SimpleItemsSelection, SimpleTimeFrame } from '@types';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = $appConfig.api.BASE_API_URL;

  public uploadUserExtendedHistory(params: {
    files: any[];
    token: string;
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/user/upload/extended-history`;

    const headers = {
      Authorization: `${params.token}`,
    };
    const body = {
      extendedhistrory: '1'
    };

    return this.http.post(endpoint, body, { headers: headers, });
  }
}
