import { AnalysisTypeEnum, ItemsSelectionEnum } from './shared.type';
import { Album, Artist, Track } from './spotify';

export type AnalysisUserExtendedHistoryUnionType =
  | TracksAnalysisUserExtendedHistory
  | AlbumsAnalysisUserExtendedHistory
  | ArtistsAnalysisUserExtendedHistory;

export interface AnalysisUserExtendedHistory<T1 extends AnalysisTypeEnum, T2 extends ItemsSelectionEnum> {
  id: string;
  userId: string;
  analysisDate: Date;
  analysisType: T1;
  analyzedItemsType: T2;

  startingDate: Date;
  endingDate: Date;
}

export interface TracksAnalysisUserExtendedHistory extends AnalysisUserExtendedHistory<
  AnalysisTypeEnum.ExtenedHistory,
  ItemsSelectionEnum.Tracks
> {
  totalMsPlayed: number;
  totalItemsPlayed: number;
  totalUniqueItemsPlayed: number;

  tracks: {
    index: number;
    trackId: Track['id'];
    artistId: Track['artists'][0]['id'];
    albumId: Track['album']['id'];

    msPlayed: number;
    timesPlayed: number;
  }[];
}

export interface AlbumsAnalysisUserExtendedHistory extends AnalysisUserExtendedHistory<
  AnalysisTypeEnum.ExtenedHistory,
  ItemsSelectionEnum.Albums
> {
  analysisVersion: string;
  totalMsPlayed: number;
  totalItemsPlayed: number;
  totalUniqueItemsPlayed: number;

  albums: {
    index: number;
    albumId: Album['id'];
    artistsIds: Album['artists'][0]['id'][];

    msPlayed: number;
    timesPlayed: number;
  }[];
}

export interface ArtistsAnalysisUserExtendedHistory extends AnalysisUserExtendedHistory<
  AnalysisTypeEnum.ExtenedHistory,
  ItemsSelectionEnum.Artists
> {
  analysisVersion: string;
  totalMsPlayed: number;
  totalItemsPlayed: number;
  totalUniqueItemsPlayed: number;

  artists: {
    index: number;
    artistId: Artist['id'];

    msPlayed: number;
    timesPlayed: number;
  }[];
}
