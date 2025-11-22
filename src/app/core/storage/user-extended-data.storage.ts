import { Injectable, signal } from '@angular/core';

import { ExtendedStreamingHistory, TracksAnalysisUserExtendedHistory } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserExtendedDataStorage {
  private readonly userExtendedData = signal<ExtendedStreamingHistory[]>([]);

  public getUserExtendedData(): ExtendedStreamingHistory[] {
    return this.userExtendedData();
  }
  public setUserExtendedData(data: ExtendedStreamingHistory[]): void {
    this.userExtendedData.set(data);
  }

  // #region Analyzed Data Storage

  private readonly _userTopTracksAnalysis = signal<TracksAnalysisUserExtendedHistory[]>([]);

  public getUserTopTracksAnalysis(params: {
    startingDate: Date;
    endingDate: Date;
  }): TracksAnalysisUserExtendedHistory | null {
    // return this._userTopTracksAnalysis();
    const analysis = this._userTopTracksAnalysis().find((analysis) => {
      return (
        analysis.analysisDate === params.startingDate &&
        analysis.analysisDate === params.endingDate
      );
    });
    return analysis ? analysis : null;
  }
  public setUserTopTracksAnalysis(params: { data: TracksAnalysisUserExtendedHistory }): void {
    this._userTopTracksAnalysis.update((prev) => [...prev, params.data]);
  }

  // #endregion Analyzed Data Storage
}
