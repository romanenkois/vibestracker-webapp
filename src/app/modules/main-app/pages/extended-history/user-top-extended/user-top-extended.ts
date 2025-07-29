import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SpotifyItemsCommand } from '@commands';
import { ExtendedHistoryService } from '@services';
import { SpotifyItemsStorage, UserStorage } from '@storage';
import { LoadingState, Track, UserPrivate } from '@types';
import { CardSimpleTrackComponent } from '@widgets';

@Component({
  selector: 'app-user-top-extended',
  imports: [CardSimpleTrackComponent],
  templateUrl: './user-top-extended.html',
  styleUrl: './user-top-extended.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTopExtended implements OnInit {
  private readonly extendedHistoryService: ExtendedHistoryService = inject(ExtendedHistoryService);
  private readonly spotifyItemsStorage: SpotifyItemsStorage = inject(SpotifyItemsStorage);
  private readonly spotifyItemsCommand: SpotifyItemsCommand = inject(SpotifyItemsCommand);
  private readonly userStorage: UserStorage = inject(UserStorage);

  private readonly initialTracksToShow = 50;
  private readonly tracksNumberToLoad = 100;

  protected listeningData: Signal<UserPrivate['listeningData']['expandedHistory'] | null> = computed(() => {
    return this.userStorage.getUser()?.listeningData?.expandedHistory || null;
  });

  protected loadingState: LoadingState = 'idle';
  protected tracksToShow: WritableSignal<number> = signal(this.initialTracksToShow);

  protected startingDate: WritableSignal<Date> = signal(new Date(0));
  protected endingDate: WritableSignal<Date> = signal(new Date());

  private tracksIds: WritableSignal<string[]> = signal([]);
  private tracksIdsToShow: Signal<string[]> = computed(() => {
    return this.tracksIds().slice(0, this.tracksToShow());
  });

  // computed(() => {
  //   const tracksId = this.extendedHistoryService
  //   .getTopTracksIds({
  //     startingDate: this.startingDate(),
  //     endingDate: this.endingDate(),
  //   })
  //     // .getTopTracks({
  //     //   startingDate: this.startingDate(),
  //     //   endingDate: this.endingDate(),
  //     // })
  //     // .slice(0, this.tracksToShow())
  //     // .map((track: any) => track.id);

  //   console.log("tracksId", tracksId);
  //   return toSignal<string[]>(tracksId) || [];
  // });

  protected topTracks = computed(() => {
    const tracks = this.spotifyItemsStorage.getTracks([...this.tracksIdsToShow()]);

    if (tracks.length !== this.tracksIdsToShow().length) {
      this.spotifyItemsCommand.loadTracks(this.tracksIdsToShow()).subscribe((status: LoadingState) => {
        this.loadingState =status;
      });
    }
    return tracks;
  });

  ngOnInit() {
    this.startingDate.set(this.listeningData()?.startingDate || new Date(0));
    this.endingDate.set(this.listeningData()?.endingDate || new Date());

    this.loadingState = 'loading';
    this.extendedHistoryService.getTopTracksIds({
      startingDate: this.startingDate(),
      endingDate: this.endingDate(),
    }).subscribe((tracksIds: string[]) => {
      this.tracksIds.set(tracksIds);
      this.loadingState = 'resolved';
      // this.loadingState.set('resolved');
    });
  }

  protected loadMoreItems() {
    this.loadingState = 'appending';
    this.tracksToShow.set(this.tracksToShow() + this.tracksNumberToLoad);
  }

  protected getTrackTimeListenedTotal(id: Track['id']): number {
    return (
      this.extendedHistoryService.topTracks().find((track: { id: string; ms_played: number }) => track.id === id)
        ?.ms_played || 0
    );
  }
}
