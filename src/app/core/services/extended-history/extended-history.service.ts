import { computed, inject, Injectable } from '@angular/core';
import { SpotifyItemsCommand } from '@commands';
import {
  UserExtandedDataStorage,
  UserStorage,
  SpotifyItemsStorage,
} from '@storage';
import { Track, ExtendedStreamingHistory, LoadingState } from '@types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryService {
  private readonly userStorage: UserStorage = inject(UserStorage);
  private readonly userExtendedDataStorage: UserExtandedDataStorage = inject(
    UserExtandedDataStorage,
  );
  private readonly spotifyItemsStorage: SpotifyItemsStorage =
    inject(SpotifyItemsStorage);
  private readonly spotifyItemsCommand: SpotifyItemsCommand =
    inject(SpotifyItemsCommand);

  public userExtendedData = computed(() => {
    return this.userExtendedDataStorage.getUserExtendedData();
  });

  getUserTopTracks(): Observable<Track[]> {
    return new Observable((observer) => {
      console.log('getUserTopTracks called');

      console.log(this.userExtendedData())

      if (this.userExtendedData().length === 0) {
        console.log('No extended history data available');
        observer.next([]);
        observer.complete();
        return;
      }

      console.log('Processing extended history data');

      const topTracks: {
        id: string;
        ms_played: number;
      }[] = this.userExtendedData()
        .reduce(
          (
            acc: { id: string; ms_played: number }[],
            item: ExtendedStreamingHistory,
          ) => {
            if (!item.uri.startsWith('spotify:track:')) {
              return acc;
            }
            const id = item.uri.split(':')[2];
            const existingTrack = acc.find((track) => track.id === id);
            if (existingTrack) {
              existingTrack.ms_played += item.ms_played;
            } else {
              acc.push({ id, ms_played: item.ms_played });
            }
            return acc;
          },
          [] as { id: string; ms_played: number }[],
        )
        .sort(
          (a: { ms_played: number }, b: { ms_played: number }) =>
            b.ms_played - a.ms_played,
        );


      console.log('Top tracks:', topTracks);

      this.spotifyItemsCommand
        .loadTracks(topTracks.map((track) => track.id))
        .subscribe((state: LoadingState) => {
          if (state === 'resolved') {
            console.log('Tracks loaded successfully');

            observer.next(
              topTracks
                .map((track) => {
                  const trackItem = this.spotifyItemsStorage.getTrack(track.id);
                  return trackItem;
                })
                .filter((track): track is Track => track !== null),
            );
            observer.complete();
          } else if (state === 'error') {
            observer.complete();
          }
        });
    });
  }
}
