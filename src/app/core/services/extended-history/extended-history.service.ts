import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable } from 'rxjs';

import { UserExtendedDataStorage } from '@storage';
import { ExtendedStreamingHistory, LoadingStatusSimpleEnum, TracksAnalysisUserExtendedHistory } from '@types';
import { runInWorker } from '@utils';

import { $appConfig } from '@environments';

import { ApiService, LoadingStatusEnum } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryService {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _apiService = inject(ApiService);
  private readonly _userExtendedDataStorage = inject(UserExtendedDataStorage);

  public topTracks = signal<{ id: string; ms_played: number }[]>([]);

  private _getTopTracks = (params: {
    data: ExtendedStreamingHistory[];
    startingDate?: Date;
    endingDate?: Date;
  }): { id: string; ms_played: number }[] => {
    const userExtendedData = params.data;

    const dataSizeMB0 = (JSON.stringify(userExtendedData).length / 1024 / 1024).toFixed(2);
    console.log(`0topTracks data size: ${dataSizeMB0} MB`);

    const filteredUserExtendedData = userExtendedData
      .reduce(
        (acc: { id: string; ms_played: number; ts: Date }[], item: ExtendedStreamingHistory) => {
          const id = item.trackId;
          const existingTrack = acc.find((track) => track.id === id);

          if (params.startingDate && new Date(item.ts) < params.startingDate) {
            return acc;
          }
          if (params.endingDate && new Date(item.ts) > params.endingDate) {
            return acc;
          }

          if (existingTrack) {
            existingTrack.ms_played += item.ms_played;
          } else {
            acc.push({ id: id, ms_played: item.ms_played, ts: item.ts });
          }
          return acc;
        },
        [] as { id: string; ms_played: number; ts: Date }[]
      )
      .sort((a: { id: string; ms_played: number }, b: { id: string; ms_played: number }) => b.ms_played - a.ms_played);

    // console.log('filteredUserExtendedData', filteredUserExtendedData);
    // const dataSizeMB = (JSON.stringify(filteredUserExtendedData).length / 1024 / 1024).toFixed(2);
    // console.log(`1topTracks data size: ${dataSizeMB} MB`);
    return filteredUserExtendedData;
  };

  public getTopTracksIds(params: { startingDate: Date; endingDate: Date }): Observable<string[]> {
    return new Observable((observer) => {
      runInWorker(this._getTopTracks, { data: this._userExtendedDataStorage.getUserExtendedData(), ...params })
        .then((topTracks) => {
          this.topTracks.set(topTracks);
          const topTrackIds = topTracks.map((track) => track.id);
          observer.next(topTrackIds);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  public getUserTopTracksAnalysis(params: {
    startingDate: Date;
    endingDate: Date;
  }): Observable<{ status: LoadingStatusSimpleEnum; data?: TracksAnalysisUserExtendedHistory }> {
    return new Observable((observer) => {
      const loadedAnalysis = this._userExtendedDataStorage.getUserTopTracksAnalysis(params);
      if (loadedAnalysis) {
        observer.next({ status: LoadingStatusSimpleEnum.Resolved, data: loadedAnalysis });
        observer.complete();
        return;
      }

      observer.next({ status: LoadingStatusSimpleEnum.Loading });
      const queryParams: Record<string, string> = {
        startingDate: params.startingDate.toISOString(),
        endingDate: params.endingDate.toISOString(),
      };
      this._apiService
        .loadSinglePieceOfData<{
          data: TracksAnalysisUserExtendedHistory;
        }>(`${$appConfig.api.BASE_API_URL}/analysis-extended-history`, queryParams)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((response) => {
          if (response.status === LoadingStatusEnum.Resolved && response.data) {
            this._userExtendedDataStorage.setUserTopTracksAnalysis({ data: response.data.data });
            observer.next({ status: LoadingStatusSimpleEnum.Resolved, data: response.data.data });
            observer.complete();
          } else if (response.status === LoadingStatusEnum.Error) {
            observer.next({ status: LoadingStatusSimpleEnum.Error });
            observer.complete();
          }
        });
    });
  }
}
