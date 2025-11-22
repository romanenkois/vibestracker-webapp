import { AnalysisTypeEnum, ItemsSelectionEnum } from './shared.type';
import { Track } from './spotify';

export interface AnalysisUserExtendedHistory<T1 extends AnalysisTypeEnum, T2 extends ItemsSelectionEnum> {
  id: string;
  userId: string;
  analysisDate: Date;
  analysisType: T1;
  analyzedItemsType: T2;

  startingDate: Date;
  endingDate: Date;
}

export interface TracksAnalysisUserExtendedHistory
  extends AnalysisUserExtendedHistory<AnalysisTypeEnum.ExtenedHistory, ItemsSelectionEnum.Tracks> {
  totalMsPlayed: number;
  totalTracksPlayed: number;
  totalUniqueTracksPlayed: number;

  tracks: {
    index: number;
    trackId: Track['id'];
    artistId: Track['artists'][0]['id'];
    albumId: Track['album']['id'];

    msPlayed: number;
    timesPlayed: number;
  }[];
}
