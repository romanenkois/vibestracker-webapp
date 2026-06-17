import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { SpotifyItemsCommand } from '@commands';
import { SpotifyItemsStorage } from '@storage';
import {
  Album,
  AnalysisUserExtendedHistoryUnionType,
  Artist,
  ItemsSelectionEnum,
  LoadingStatusEnum,
  Track,
  TracksAnalysisUserExtendedHistory,
} from '@types';
import { CardSimpleTrackComponent } from '@widgets';

interface DisplayedAnalysisItem {
  index: number;
  msPlayed: number;
  timesPlayed: number;

  track?: Track;
  album?: Album;
  artist?: Artist;
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

  userTopTracksAnalysis = input.required<AnalysisUserExtendedHistoryUnionType | null>();
  analysisType = input.required<ItemsSelectionEnum>();

  protected loadingState = LoadingStatusEnum.Idle;

  private tracksToShowNumber = signal<number>(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);
  private artistsToShowNumber = signal<number>(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);
  private albumsToShowNumber = signal<number>(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

  protected currentlyDisplayedItemsNumber = computed<number>(() => {
    const analysisType = this.analysisType();
    if (analysisType === ItemsSelectionEnum.Tracks) {
      return this.tracksToShowNumber();
    } else if (analysisType === ItemsSelectionEnum.Albums) {
      return this.albumsToShowNumber();
    } else if (analysisType === ItemsSelectionEnum.Artists) {
      return this.artistsToShowNumber();
    } else {
      return 0;
    }
  });

  protected totalItemsNumberInAnalysis = computed<number>(() => {
    const analysis = this.userTopTracksAnalysis();
    if (!analysis) {
      return 0;
    }

    if ('tracks' in analysis) {
      return analysis.tracks.length;
    } else if ('albums' in analysis) {
      return analysis.albums.length;
    } else if ('artists' in analysis) {
      return analysis.artists.length;
    } else {
      return 0;
    }
  });

  protected trackIds = computed<string[]>(() => {
    const analysis = this.userTopTracksAnalysis();
    if (!analysis || !('tracks' in analysis)) {
      return [];
    }

    return analysis.tracks.map((track) => track.trackId).slice(0, this.tracksToShowNumber());
  });
  protected albumIds = computed<string[]>(() => {
    const analysis = this.userTopTracksAnalysis();
    if (!analysis || !('albums' in analysis)) {
      return [];
    }

    return analysis.albums.map((album) => album.albumId).slice(0, this.albumsToShowNumber());
  });
  protected artistIds = computed<string[]>(() => {
    const analysis = this.userTopTracksAnalysis();
    if (!analysis || !('artists' in analysis)) {
      return [];
    }

    return analysis.artists.map((artist) => artist.artistId).slice(0, this.artistsToShowNumber());
  });

  protected curentlyDisplayedItemsIdsNumber = computed<number>(() => {
    const analysis = this.userTopTracksAnalysis();
    if (!analysis) {
      return 0;
    }

    if ('tracks' in analysis) {
      return this.trackIds().length;
    } else if ('albums' in analysis) {
      return this.albumIds().length;
    } else if ('artists' in analysis) {
      return this.artistIds().length;
    } else {
      return 0;
    }
  });

  private spotifyTracks = computed<Track[]>(() => this._spotifyItemsStorage.getTracks(this.trackIds()));
  private spotifyAlbums = computed<Album[]>(() => this._spotifyItemsStorage.getAlbums(this.albumIds()));
  private spotifyArtists = computed<Artist[]>(() => this._spotifyItemsStorage.getArtists(this.artistIds()));

  protected displayedAnalysis = computed<DisplayedAnalysisItem[]>(() => {
    const analysis = this.userTopTracksAnalysis();
    const tracks = this.spotifyTracks();
    if (!analysis || !tracks.length) {
      this.loadingState = LoadingStatusEnum.ResolvedEmpty;
      return [];
    }

    const finalRes: DisplayedAnalysisItem[] = [];
    const itemsToShow = Math.min(this.tracksToShowNumber(), analysis.tracks.length);
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
      this._loadSpotifyItems();
    });
    effect(() => {
      const analysisType = this.analysisType();
      if (analysisType === ItemsSelectionEnum.Tracks) {
        this.tracksToShowNumber.set(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

        this.albumsToShowNumber.set(0);
        this.artistsToShowNumber.set(0);
      } else if (analysisType === ItemsSelectionEnum.Albums) {
        this.albumsToShowNumber.set(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

        this.tracksToShowNumber.set(0);
        this.artistsToShowNumber.set(0);
      } else if (analysisType === ItemsSelectionEnum.Artists) {
        this.artistsToShowNumber.set(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

        this.tracksToShowNumber.set(0);
        this.albumsToShowNumber.set(0);
      }
    });
  }

  private _loadSpotifyItems() {
    this.loadingState = LoadingStatusEnum.Loading;

    const analysis = this.userTopTracksAnalysis();
    if (!analysis) {
      this.loadingState = LoadingStatusEnum.Error;
      return;
    }

    switch (this.analysisType()) {
      case ItemsSelectionEnum.Tracks:
        this._spotifyItemsCommand.loadTracks(this.trackIds()).subscribe((status) => {
          if (status === LoadingStatusEnum.Error) {
            this.loadingState = LoadingStatusEnum.Error;
          }
        });
        break;

      case ItemsSelectionEnum.Albums:
        this._spotifyItemsCommand.loadAlbums(this.albumIds()).subscribe((status) => {
          if (status === LoadingStatusEnum.Error) {
            this.loadingState = LoadingStatusEnum.Error;
          }
        });
        break;

      case ItemsSelectionEnum.Artists:
        this._spotifyItemsCommand.loadArtists(this.artistIds()).subscribe((status) => {
          if (status === LoadingStatusEnum.Error) {
            this.loadingState = LoadingStatusEnum.Error;
          }
        });
        break;

      default:
        this.loadingState = LoadingStatusEnum.Error;
        break;
    }
  }

  protected loadMoreItems() {
    this.loadingState = LoadingStatusEnum.Appending;
    switch (this.analysisType()) {
      case ItemsSelectionEnum.Tracks:
        this.tracksToShowNumber.set(this.tracksToShowNumber() + this.TRACKS_NUMBER_TO_LOAD);
        break;

      case ItemsSelectionEnum.Albums:
        this.albumsToShowNumber.set(this.albumsToShowNumber() + this.TRACKS_NUMBER_TO_LOAD);
        break;

      case ItemsSelectionEnum.Artists:
        this.artistsToShowNumber.set(this.artistsToShowNumber() + this.TRACKS_NUMBER_TO_LOAD);
        break;
    }
    this._loadSpotifyItems();
  }
}
