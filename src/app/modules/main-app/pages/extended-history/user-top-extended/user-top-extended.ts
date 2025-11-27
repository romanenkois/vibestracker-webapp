import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { SpotifyItemsCommand } from '@commands';
import { SpotifyItemsStorage } from '@storage';
import { LoadingStatusEnum, Track, TracksAnalysisUserExtendedHistory } from '@types';
import { CardSimpleTrackComponent } from '@widgets';

interface DisplayedAnalysisItem {
  index: number;
  track: Track | null;
  msPlayed: number;
  timesPlayed: number;
}

@Component({
  selector: 'app-user-top-extended',
  imports: [CardSimpleTrackComponent],
  templateUrl: './user-top-extended.html',
  styleUrls: ['./user-top-extended.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTopExtended {
  private readonly _spotifyItemsStorage = inject(SpotifyItemsStorage);
  private readonly _spotifyItemsCommand = inject(SpotifyItemsCommand);

  private readonly INITIAL_NUMBER_OF_ITEMS_TO_LOAD = 100;
  private readonly TRACKS_NUMBER_TO_LOAD = 100;

  userTopTracksAnalysis = input.required<TracksAnalysisUserExtendedHistory | null>();

  protected loadingState = LoadingStatusEnum.Idle;
  private tracksToShow = signal<number>(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

  protected trackIds = computed<string[]>(() =>
    this.userTopTracksAnalysis()
      ? this.userTopTracksAnalysis()!
          .tracks.map((track) => track.trackId)
          .slice(0, this.tracksToShow())
      : []
  );
  private spotifyTracks = computed<Track[]>(() => this._spotifyItemsStorage.getTracks(this.trackIds()));
  protected displayedAnalysis = computed<DisplayedAnalysisItem[]>(() => {
    const analysis = this.userTopTracksAnalysis();
    const tracks = this.spotifyTracks();
    if (!analysis || !tracks.length) {
      this.loadingState = LoadingStatusEnum.ResolvedEmpty;
      return [];
    }

    const finalRes: DisplayedAnalysisItem[] = [];
    const itemsToShow = Math.min(this.tracksToShow(), analysis.tracks.length);
    for (let i = 0; i < itemsToShow; i++) {
      finalRes.push({
        index: analysis.tracks[i].index,
        track: tracks.find((t) => t.id === analysis.tracks[i].trackId) || null,
        msPlayed: analysis.tracks[i].msPlayed,
        timesPlayed: analysis.tracks[i].timesPlayed,
      });
    }
    this.loadingState = LoadingStatusEnum.Resolved;

    return finalRes;
  });

  constructor() {
    effect(() => {
      this._loadSpotifyTracks();
    });
  }

  private _loadSpotifyTracks() {
    this.loadingState = LoadingStatusEnum.Loading;

    const trackIds: string[] =
      this.userTopTracksAnalysis()
        ?.tracks.map((track) => track.trackId)
        .slice(0, this.tracksToShow()) || [];

    this._spotifyItemsCommand.loadTracks(trackIds).subscribe((status) => {
      if (status === LoadingStatusEnum.Error) {
        this.loadingState = LoadingStatusEnum.Error;
      }
    });
  }

  protected loadMoreItems() {
    this.loadingState = LoadingStatusEnum.Appending;
    this.tracksToShow.set(this.tracksToShow() + this.TRACKS_NUMBER_TO_LOAD);
    this._loadSpotifyTracks();
  }
}
