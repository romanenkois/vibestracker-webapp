import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { SpotifyItemsCommand } from '@commands';
import { ExtendedHistoryService } from '@services';
import { SpotifyItemsStorage, UserStorage } from '@storage';
import { LoadingStatusEnum, Track } from '@types';
import { CardSimpleTrackComponent } from '@widgets';

@Component({
  selector: 'app-user-top-extended',
  imports: [CardSimpleTrackComponent],
  templateUrl: './user-top-extended.html',
  styleUrls: ['./user-top-extended.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTopExtended implements OnInit {
  private readonly extendedHistoryService: ExtendedHistoryService = inject(ExtendedHistoryService);
  private readonly spotifyItemsStorage: SpotifyItemsStorage = inject(SpotifyItemsStorage);
  private readonly spotifyItemsCommand: SpotifyItemsCommand = inject(SpotifyItemsCommand);
  private readonly userStorage: UserStorage = inject(UserStorage);

  private readonly INITIAL_NUMBER_OF_ITEMS_TO_LOAD = 50;
  private readonly TRACKS_NUMBER_TO_LOAD = 100;

  protected loadingState = LoadingStatusEnum.Idle;
  protected tracksToShow = signal<number>(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

  startingDate = input.required<Date>();
  endingDate = input.required<Date>();

  private tracksIds = signal<string[]>([]);
  private tracksIdsToShow = computed<string[]>(() => {
    return this.tracksIds().slice(0, this.tracksToShow());
  });

  protected topTracks = computed<Track[]>(() => {
    return this.spotifyItemsStorage.getTracks([...this.tracksIdsToShow()]);
  });

  constructor() {
    effect(() => {
      const tracks = this.spotifyItemsStorage.getTracks([...this.tracksIdsToShow()]);
      if (tracks.length !== this.tracksIdsToShow().length) {
        this.spotifyItemsCommand.loadTracks(this.tracksIdsToShow()).subscribe((status) => {
          this.loadingState = status;
        });
      }
    });
  }

  ngOnInit() {
    this.loadingState = LoadingStatusEnum.Loading;
    this.extendedHistoryService
      .getTopTracksIds({
        startingDate: this.startingDate(),
        endingDate: this.endingDate(),
      })
      .subscribe((tracksIds: string[]) => {
        this.tracksIds.set(tracksIds);
        this.loadingState = LoadingStatusEnum.Resolved;
        // this.loadingState.set('resolved');
      });
  }

  protected loadMoreItems() {
    this.loadingState = LoadingStatusEnum.Appending;
    this.tracksToShow.set(this.tracksToShow() + this.TRACKS_NUMBER_TO_LOAD);
  }

  protected getTrackTimeListenedTotal(id: Track['id']): number {
    return (
      this.extendedHistoryService.topTracks().find((track: { id: string; ms_played: number }) => track.id === id)
        ?.ms_played || 0
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getTrackTimesPlayedTotal(id: Track['id']): number {
    return 0;
    // return (
    //   this.extendedHistoryService.topTracks().find((track: { id: string; times_played: number }) => track.id === id)
    //     ?.times_played || 0
    // );
  }
}
