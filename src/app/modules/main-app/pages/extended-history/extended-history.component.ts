import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

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
  private readonly _activeRoute = inject(ActivatedRoute);

  protected listeningDataRecord = computed<UserPrivate['listeningData']['expandedHistory'] | null>(() => {
    const listeningData = this._userStorage.getUser()?.listeningData?.expandedHistory;
    return listeningData ? listeningData : null;
  });
  protected userTopTracksAnalysis = signal<TracksAnalysisUserExtendedHistory | null>(null);
  protected loadingState = LoadingStatusEnum.Idle;

  protected userStartingDate = computed<Date>(() => {
    const dateStr = this.listeningDataRecord()?.startingDate;
    return dateStr ? new Date(dateStr) : new Date(0);
  });
  protected userEndingDate = computed<Date>(() => {
    const dateStr = this.listeningDataRecord()?.endingDate;
    return dateStr ? new Date(dateStr) : new Date();
  });
  protected startingDate = signal<Date>(new Date(0));
  protected endingDate = signal<Date>(new Date());

  // constructor() {
  //   // effect(() => {
  //   //   const startDate = this.startingDate();
  //   //   const endDate = this.endingDate();

  //   //   this.loadUserTopTracksAnalysis({ startingDate: startDate, endingDate: endDate });
  //   // });
  // }

  ngOnInit() {
    const startingDate = new Date(this.listeningDataRecord()?.startingDate || new Date(0));
    const endingDate = new Date(this.listeningDataRecord()?.endingDate || new Date());

    this.startingDate.set(startingDate);
    this.endingDate.set(endingDate);

    this.loadUserTopTracksAnalysis({ startingDate, endingDate });

    this._activeRoute.queryParams.subscribe((params) => {
      const startingDateParam = params['start-date'];
      const endingDateParam = params['end-date'];

      if (startingDateParam && endingDateParam) {
        const startingDate = new Date(startingDateParam);
        const endingDate = new Date(endingDateParam);

        this.startingDate.set(startingDate);
        this.endingDate.set(endingDate);

        this.loadUserTopTracksAnalysis({ startingDate, endingDate });
      } else {
        this.startingDate.set(this.userStartingDate());
        this.endingDate.set(this.userEndingDate());

        this.loadUserTopTracksAnalysis({ startingDate, endingDate });
      }
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
        }
        if (analysis.status === LoadingStatusSimpleEnum.Error) {
          this.loadingState = LoadingStatusEnum.Error;
        }
      });
  }
}
