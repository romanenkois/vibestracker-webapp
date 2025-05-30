import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { $appConfig } from '@environments';
import {
  SimpleItemsSelection,
  SimpleTimeFrame,
  ExtendedStreamingHistoryDTO,
} from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = $appConfig.api.BASE_API_URL;

  public getUserPrivate() {
    return this.http.get(`${this.baseUrl}/user-private`);
  }

  public getUserTopItemsSimple(params: {
    type: SimpleItemsSelection;
    timeFrame: SimpleTimeFrame;
    limit: number;
    offset: number;
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/top-items?type=${params.type}&timeFrame=${params.timeFrame}&limit=${params.limit}&offset=${params.offset}`;

    return this.http.get(endpoint);
  }

  public uploadUserExtendedHistory(params: {
    history: ExtendedStreamingHistoryDTO[];
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/extended-history`;
    const body = {
      extendedHistrory: params.history,
    };

    return this.http.post(endpoint, body);
  }

  public getUserExtendedHistory(
    startingDate: Date,
    endingDate: Date,
  ): Observable<any> {
    const endpoint = `${this.baseUrl}/extended-history?startingDate=${startingDate.toISOString()}&endingDate=${endingDate.toISOString()}`;

    return this.http.get<any>(endpoint);
  }
}
