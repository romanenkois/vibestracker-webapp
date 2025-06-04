import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { SpotifyItemsCommand } from '@commands';
import { ExtendedHistoryService } from '@services';
import { SpotifyItemsStorage, UserStorage } from '@storage';
import { LoadingState, Track, UserPrivate } from '@types';
import { CardSimpleTrackComponent } from '../../features/cards/card-simple-track/card-simple-track.component';

@Component({
  selector: 'app-user-top-extended',
  imports: [CardSimpleTrackComponent],
  templateUrl: './user-top-extended.html',
  styleUrl: './user-top-extended.scss',
})
export class UserTopExtended implements OnInit {
  private extendedHistoryService: ExtendedHistoryService = inject(
    ExtendedHistoryService,
  );
  private readonly spotifyItemsStorage: SpotifyItemsStorage =
    inject(SpotifyItemsStorage);
  private readonly spotifyItemsCommand: SpotifyItemsCommand =
    inject(SpotifyItemsCommand);

  listeningData: InputSignal<UserPrivate['listeningData'][0]> =
    input.required();

  loadingState: LoadingState = 'idle';
  tracksToShow: WritableSignal<number> = signal(50);

  startingDate: WritableSignal<Date> = signal(new Date(0));
  endingDate: WritableSignal<Date> = signal(new Date());

  protected tracksIds = computed(() => {
    return this.extendedHistoryService
      .getTopTracks({
        startingDate: this.startingDate(),
        endingDate: this.endingDate(),
      })
      .slice(0, this.tracksToShow())
      .map((track: any) => track.id);
  });

  protected topTracks = computed(() => {
    const tracks = this.spotifyItemsStorage.getTracks([...this.tracksIds()]);

    if (tracks.length !== this.tracksIds().length) {
      this.spotifyItemsCommand
        .loadTracks(this.tracksIds())
        .subscribe((status: LoadingState) => {
          this.loadingState = status;
        });
    }
    return tracks;
  });

  loadMoreItems() {
    this.loadingState = 'appending';
    this.tracksToShow.set(this.tracksToShow() + 100);
  }

  getTimeListened(id: Track['id']): number {
    const track = this.extendedHistoryService
      .topTracks()
      .find((track: Track) => track.id === id);
    return track ? track.ms_played : 0;
  }

  ngOnInit() {
    this.startingDate.set(this.listeningData().startingDate || new Date(0));
    this.endingDate.set(this.listeningData().endingDate || new Date());
  }
}
