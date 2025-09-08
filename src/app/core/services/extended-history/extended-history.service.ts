import { literalMap } from '@angular/compiler';
import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { SpotifyItemsCommand } from '@commands';
import { UserExtendedDataStorage, UserStorage, SpotifyItemsStorage } from '@storage';
import { Track, ExtendedStreamingHistory, LoadingState } from '@types';
import { Observable } from 'rxjs';

export function runInWorker<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  ...args: TArgs
): Promise<TResult> {
  return new Promise((resolve, reject) => {
    const fnString = fn.toString();

    const workerBlob = new Blob(
      [
        `
        self.onmessage = async (e) => {
          const [fnString, args] = e.data;
          const fn = new Function('return (' + fnString + ')')();
          try {
            const result = await fn(...args);
            self.postMessage({ result });
          } catch (err) {
            self.postMessage({ error: err.toString() });
          }
        };
      `,
      ],
      { type: 'application/javascript' },
    );

    const worker = new Worker(URL.createObjectURL(workerBlob));

    worker.onmessage = (e) => {
      const { result, error } = e.data;
      if (error) reject(error);
      else resolve(result);
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(err.message);
      worker.terminate();
    };

    worker.postMessage([fnString, args]);
  });
}

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryService {
  // private readonly userStorage: UserStorage = inject(UserStorage);
  private readonly userExtendedDataStorage: UserExtendedDataStorage = inject(UserExtendedDataStorage);

  public userExtendedData = computed(() => {
    return this.userExtendedDataStorage.getUserExtendedData();
  });

  public topTracks: WritableSignal<{ id: string; ms_played: number }[]> = signal([]);

  private getTopTracks = (params: {
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
        [] as { id: string; ms_played: number; ts: Date }[],
      )
      .sort((a: { id: string; ms_played: number }, b: { id: string; ms_played: number }) => b.ms_played - a.ms_played);

    // console.log('filteredUserExtendedData', filteredUserExtendedData);
    // const dataSizeMB = (JSON.stringify(filteredUserExtendedData).length / 1024 / 1024).toFixed(2);
    // console.log(`1topTracks data size: ${dataSizeMB} MB`);
    return filteredUserExtendedData;
  };

  public getTopTracksIds(params: { startingDate?: Date; endingDate?: Date }): Observable<string[]> {
    return new Observable((observer) => {
      runInWorker(this.getTopTracks, { data: this.userExtendedDataStorage.getUserExtendedData(), ...params })
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
}
