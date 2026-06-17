import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';

export enum LoadingStatusEnum {
  Idle = 'idle',
  Loading = 'loading',
  Resolved = 'resolved',
  Error = 'error',
}

export interface ApiResponse<T> {
  status: LoadingStatusEnum;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly _http = inject(HttpClient);

  public loadSinglePieceOfData<T>(
    apiEndpoint: string,
    // requestedId: string,
    queryParams: Record<string, number | string>
  ): Observable<ApiResponse<T>> {
    return new Observable<ApiResponse<T>>((observer) => {
      observer.next({ status: LoadingStatusEnum.Loading });

      const _httpQueryParams = new HttpParams({
        fromObject: queryParams,
      });

      this._http
        .get(apiEndpoint, { params: _httpQueryParams })
        .pipe(
          finalize(() => {
            observer.complete();
          })
        )
        .subscribe({
          next: (res) => {
            observer.next({
              status: LoadingStatusEnum.Resolved,
              data: res as unknown as T,
            });
          },
          error: (err) => {
            observer.next({ status: LoadingStatusEnum.Error, error: err.toString() });
          },
        });
    });
  }
}
