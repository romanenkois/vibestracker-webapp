import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';

import { SpotifyItemsCommand } from '@commands';
import { SpotifyItemsStorage } from '@storage';
import {
  Album,
  AnalysisUserExtendedHistoryUnionType,
  Artist,
  ItemsSelectionEnum,
  LoadingStatusEnum,
  Track,
} from '@types';
import { CardSimpleAlbumComponent, CardSimpleArtistComponent, CardSimpleTrackComponent } from '@widgets';

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
  imports: [CardSimpleTrackComponent, CardSimpleAlbumComponent, CardSimpleArtistComponent],
  templateUrl: './user-top-extended.html',
  styleUrls: ['./user-top-extended.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTopExtended {
  private readonly _spotifyItemsStorage = inject(SpotifyItemsStorage);
  private readonly _spotifyItemsCommand = inject(SpotifyItemsCommand);

  private readonly INITIAL_NUMBER_OF_ITEMS_TO_LOAD = 100;
  private readonly ITEMS_NUMBER_TO_LOAD = 100;

  userExtendedAnalysis = input.required<AnalysisUserExtendedHistoryUnionType | null>();
  analyzedItemsType = input.required<ItemsSelectionEnum>();

  protected loadingState = signal<LoadingStatusEnum>(LoadingStatusEnum.Idle);

  private itemsToShowNumber = signal<number>(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);

  protected totalItemsNumber = computed<number>(() => {
    const analysis = this.userExtendedAnalysis();
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

  private itemIds = computed<string[]>(() => {
    const analysis = this.userExtendedAnalysis();
    const limit = this.itemsToShowNumber();
    if (!analysis) {
      return [];
    }

    if ('tracks' in analysis) {
      return analysis.tracks.map((track) => track.trackId).slice(0, limit);
    } else if ('albums' in analysis) {
      return analysis.albums.map((album) => album.albumId).slice(0, limit);
    } else if ('artists' in analysis) {
      return analysis.artists.map((artist) => artist.artistId).slice(0, limit);
    } else {
      return [];
    }
  });

  protected displayedItemsCount = computed<number>(() => this.itemIds().length);

  protected displayedAnalysis = computed<DisplayedAnalysisItem[]>(() => {
    const analysis = this.userExtendedAnalysis();
    const limit = this.itemsToShowNumber();
    if (!analysis) {
      return [];
    }

    if ('tracks' in analysis) {
      const tracks = this._spotifyItemsStorage.getTracks(this.itemIds());
      return analysis.tracks.slice(0, limit).map((entry) => ({
        index: entry.index,
        msPlayed: entry.msPlayed,
        timesPlayed: entry.timesPlayed,
        track: tracks.find((track) => track.id === entry.trackId),
      }));
    } else if ('albums' in analysis) {
      const albums = this._spotifyItemsStorage.getAlbums(this.itemIds());
      return analysis.albums.slice(0, limit).map((entry) => ({
        index: entry.index,
        msPlayed: entry.msPlayed,
        timesPlayed: entry.timesPlayed,
        album: albums.find((album) => album.id === entry.albumId),
      }));
    } else if ('artists' in analysis) {
      const artists = this._spotifyItemsStorage.getArtists(this.itemIds());
      return analysis.artists.slice(0, limit).map((entry) => ({
        index: entry.index,
        msPlayed: entry.msPlayed,
        timesPlayed: entry.timesPlayed,
        artist: artists.find((artist) => artist.id === entry.artistId),
      }));
    } else {
      return [];
    }
  });

  constructor() {
    // Reset paging whenever the user switches the analyzed items type.
    effect(() => {
      this.analyzedItemsType();
      this.itemsToShowNumber.set(this.INITIAL_NUMBER_OF_ITEMS_TO_LOAD);
    });

    // (Re)load the Spotify items backing the ids that should currently be displayed.
    effect(() => {
      const ids = this.itemIds();
      const itemsType = this.analyzedItemsType();
      if (!ids.length) {
        return;
      }

      untracked(() => this._loadSpotifyItems(ids, itemsType));
    });
  }

  private _loadSpotifyItems(ids: string[], itemsType: ItemsSelectionEnum) {
    if (this.loadingState() !== LoadingStatusEnum.Appending) {
      this.loadingState.set(LoadingStatusEnum.Loading);
    }

    let loader;
    switch (itemsType) {
      case ItemsSelectionEnum.Tracks:
        loader = this._spotifyItemsCommand.loadTracks(ids);
        break;
      case ItemsSelectionEnum.Albums:
        loader = this._spotifyItemsCommand.loadAlbums(ids);
        break;
      case ItemsSelectionEnum.Artists:
        loader = this._spotifyItemsCommand.loadArtists(ids);
        break;
      default:
        this.loadingState.set(LoadingStatusEnum.Error);
        return;
    }

    loader.subscribe((status) => {
      if (status === LoadingStatusEnum.Error) {
        this.loadingState.set(LoadingStatusEnum.Error);
      } else if (status === LoadingStatusEnum.Resolved) {
        const allLoaded = this.displayedItemsCount() >= this.totalItemsNumber();
        this.loadingState.set(allLoaded ? LoadingStatusEnum.AllResolved : LoadingStatusEnum.Resolved);
      }
    });
  }

  protected loadMoreItems() {
    if (this.displayedItemsCount() >= this.totalItemsNumber()) {
      return;
    }

    this.loadingState.set(LoadingStatusEnum.Appending);
    this.itemsToShowNumber.set(this.itemsToShowNumber() + this.ITEMS_NUMBER_TO_LOAD);
  }
}
