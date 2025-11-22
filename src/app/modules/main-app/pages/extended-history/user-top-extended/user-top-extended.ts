import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { SpotifyItemsCommand } from '@commands';
import { ExtendedHistoryService } from '@services';
import { SpotifyItemsStorage } from '@storage';
import { LoadingStatusEnum, LoadingStatusSimpleEnum, Track, TracksAnalysisUserExtendedHistory } from '@types';
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
  private readonly _extendedHistoryService = inject(ExtendedHistoryService);
  private readonly _spotifyItemsStorage = inject(SpotifyItemsStorage);
  private readonly _spotifyItemsCommand = inject(SpotifyItemsCommand);

  private readonly INITIAL_NUMBER_OF_ITEMS_TO_LOAD = 50;
  private readonly TRACKS_NUMBER_TO_LOAD = 100;

  startingDate = input.required<Date>();
  endingDate = input.required<Date>();

  protected loadingState = LoadingStatusEnum.Idle;
  private tracksToShow = signal<number>(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

  private userTopTracksAnalysis = signal<TracksAnalysisUserExtendedHistory | null>(null);
  private trackIds = computed<string[]>(() =>
    this.userTopTracksAnalysis()
      ? this.userTopTracksAnalysis()!.tracks.map((track) => track.trackId).slice(0, this.tracksToShow())
      : []
  );
  private spotifyTracks = computed<Track[]>(()=> this._spotifyItemsStorage.getTracks(this.trackIds()));
  protected displayedAnalysis = computed<DisplayedAnalysisItem[]>(() => {
    const analysis = this.userTopTracksAnalysis();
    const tracks = this.spotifyTracks();
    if (!analysis || !tracks.length) {
      return [];
    }

    const finalRes: DisplayedAnalysisItem[] = [];
    for (let i = 0; i < this.tracksToShow(); i++) {
      finalRes.push({
        index: analysis?.tracks[i].index || 0,
        track: tracks.find((t) => t.id === analysis?.tracks[i].trackId) || null,
        msPlayed: analysis?.tracks[i].msPlayed || 0,
        timesPlayed: analysis?.tracks[i].timesPlayed || 0,
      });
    }
    console.log(finalRes);
    this.loadingState = LoadingStatusEnum.Resolved;

    return finalRes;
  });

  constructor() {
    effect(() => {
      const analysis = this.userTopTracksAnalysis();
      if (
        analysis?.startingDate.getTime() === this.startingDate().getTime() &&
        analysis?.endingDate.getTime() === this.endingDate().getTime()
      ) {
        return;
      }
      this.loadUserTopTracksAnalysis({ startingDate: this.startingDate(), endingDate: this.endingDate() });
    });
  }

  protected loadUserTopTracksAnalysis(params: { startingDate: Date; endingDate: Date }) {
    this.userTopTracksAnalysis.set(null);

    this.loadingState = LoadingStatusEnum.Loading;
    this._extendedHistoryService
      .getUserTopTracksAnalysis({
        startingDate: params.startingDate,
        endingDate: params.endingDate,
      })
      .subscribe((analysis) => {
        if (analysis.data) {
          this.userTopTracksAnalysis.set(analysis.data);
          this.loadingState = LoadingStatusEnum.Finalizing;
          this._loadSpotifyTracks();
        }
        if (analysis.status === LoadingStatusSimpleEnum.Error) {
          this.loadingState = LoadingStatusEnum.Error;
        }
      });
  }

  private _loadSpotifyTracks() {
    const trackIds: string[] =
      this.userTopTracksAnalysis()
        ?.tracks.map((track) => track.trackId)
        .slice(0, this.tracksToShow()) || [];

    this._spotifyItemsCommand.loadTracks(trackIds).subscribe((status) => {
      console.log(status);
      if (status === LoadingStatusEnum.Resolved) {
        this.loadingState = LoadingStatusEnum.Resolved;
      } else if (status === LoadingStatusEnum.Error) {
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
