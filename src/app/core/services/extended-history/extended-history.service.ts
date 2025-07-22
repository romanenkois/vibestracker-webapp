import { literalMap } from '@angular/compiler';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { SpotifyItemsCommand } from '@commands';
import { UserExtendedDataStorage, UserStorage, SpotifyItemsStorage } from '@storage';
import { Track, ExtendedStreamingHistory, LoadingState } from '@types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryService {
  // private readonly userStorage: UserStorage = inject(UserStorage);
  private readonly userExtendedDataStorage: UserExtendedDataStorage = inject(UserExtendedDataStorage);

  public userExtendedData = computed(() => {
    return this.userExtendedDataStorage.getUserExtendedData();
  });

  public topTracks: Signal<{ id: string; ms_played: number }[]> = computed(() => {
    console.log('recalculating top tracks');
    return this.userExtendedDataStorage
      .getUserExtendedData()
      .reduce(
        (acc: { id: string; ms_played: number }[], item: ExtendedStreamingHistory) => {
          const id = item.uri;
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
      .sort((a: { id: string; ms_played: number }, b: { id: string; ms_played: number }) => b.ms_played - a.ms_played);
  });

  public getTopTracks(params: { startingDate?: Date; endingDate?: Date }): { id: string; ms_played: number }[] {
    return this.userExtendedDataStorage
      .getUserExtendedData()
      .reduce(
        (acc: { id: string; ms_played: number; ts: string }[], item: ExtendedStreamingHistory) => {
          const id = item.uri;
          const existingTrack = acc.find((track) => track.id === id);

          if (params.startingDate && new Date(item.ts) < params.startingDate) {
            return;
          }
          if (params.endingDate && new Date(item.ts) > params.endingDate) {
            return;
          }

          if (existingTrack) {
            existingTrack.ms_played += item.ms_played;
          } else {
            acc.push({ id: id, ms_played: item.ms_played, ts: item.ts });
          }
          return acc;
        },
        [] as { id: string; ms_played: number; ts: string }[],
      )
      .sort((a: { id: string; ms_played: number }, b: { id: string; ms_played: number }) => b.ms_played - a.ms_played)
      .slice(0, 1000);
  }
}
