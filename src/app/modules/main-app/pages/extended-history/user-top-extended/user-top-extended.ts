import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
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

  protected listeningData: Signal<UserPrivate['listeningData']['expandedHistory'] | null> = computed(() => {
    const user = this.userStorage.getUser();

    const listeningData = user?.listeningData?.expandedHistory;

    return listeningData ? listeningData : null;
  });

  protected loadingState: LoadingState = 'idle';
  protected tracksToShow: WritableSignal<number> = signal(50);

  protected startingDate: WritableSignal<Date> = signal(new Date(0));
  protected endingDate: WritableSignal<Date> = signal(new Date());

  private tracksIds = computed(() => {
    return this.extendedHistoryService
      .getTopTracks({
        startingDate: this.startingDate(),
        endingDate: this.endingDate(),
      })
      .filter((track: any) => {
        return this.userStorage.getUser()?.ignoredTracks.includes(track.id) === false;
      })
      .slice(0, this.tracksToShow())
      .map((track: any) => track.id);
  });

  protected topTracks = computed(() => {
    const tracks = this.spotifyItemsStorage.getTracks([...this.tracksIds()]);

    if (tracks.length !== this.tracksIds().length) {
      this.spotifyItemsCommand.loadTracks(this.tracksIds()).subscribe((status: LoadingState) => {
        this.loadingState = status;
      });
    }
    return tracks;
  });

  protected loadMoreItems() {
    this.loadingState = 'appending';
    this.tracksToShow.set(this.tracksToShow() + 100);
  }

  protected getTimeListened(id: Track['id']): number {
    const track = this.extendedHistoryService.topTracks().find((track: Track) => track.id === id);
    return track ? track.ms_played : 0;
  }

  ngOnInit() {
    this.startingDate.set(this.listeningData()?.startingDate || new Date(0));
    this.endingDate.set(this.listeningData()?.endingDate || new Date());
  }
}
