import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { $appConfig } from '@environments';
import { SimpleItemsSelection, SimpleTimeFrame } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserItemsApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = $appConfig.api.BASE_API_URL;

  public getUserTopItemsSimple(params: {
    type: SimpleItemsSelection;
    timeFrame: SimpleTimeFrame;
    limit: number;
    offset: number;
    token: string;
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/user/top-items?type=${params.type}&timeFrame=${params.timeFrame}&limit=${params.limit}&offset=${params.offset}`;

    const headers = {
      Authorization: `${params.token}`,
    };

    return this.http.get(endpoint, { headers: headers });
  }
}
