import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ExtendedHistoryService } from '@services';
import { UserStorage } from '@storage';
import { LoadingStatusEnum, LoadingStatusSimpleEnum, TracksAnalysisUserExtendedHistory, UserPrivate } from '@types';

import { ExtendedHistoryFilter } from './extended-history-filter/extended-history-filter';
import { GeneralStatsComponent } from './general-stats/general-stats';
import { UserTopExtended } from './user-top-extended/user-top-extended';

@Component({
  selector: 'app-extended-history',
  imports: [RouterLink, UserTopExtended, GeneralStatsComponent, ExtendedHistoryFilter],
  templateUrl: './extended-history.component.html',
  styleUrl: './extended-history.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class ExtendedHistoryComponent implements OnInit {
  private readonly _userStorage = inject(UserStorage);
  private readonly _extendedHistoryService = inject(ExtendedHistoryService);

  protected listeningDataRecord = computed<UserPrivate['listeningData']['expandedHistory'] | null>(() => {
    const listeningData = this._userStorage.getUser()?.listeningData?.expandedHistory;
    return listeningData ? listeningData : null;
  });
  protected userTopTracksAnalysis = signal<TracksAnalysisUserExtendedHistory | null>(null);
  protected loadingState = LoadingStatusEnum.Idle;

  protected startingDate = signal<Date>(new Date(0));
  protected endingDate = signal<Date>(new Date());

  ngOnInit() {
    const startingDate = new Date(this.listeningDataRecord()?.startingDate || new Date(0));
    const endingDate = new Date(this.listeningDataRecord()?.endingDate || new Date());

    this.startingDate.set(startingDate);
    this.endingDate.set(endingDate);

    this.loadUserTopTracksAnalysis({ startingDate, endingDate });
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
        }
        if (analysis.status === LoadingStatusSimpleEnum.Error) {
          this.loadingState = LoadingStatusEnum.Error;
        }
      });
  }
}
