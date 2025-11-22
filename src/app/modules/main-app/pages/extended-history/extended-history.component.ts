import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserStorage } from '@storage';
import { LoadingStatusEnum, UserPrivate } from '@types';

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
  private readonly userStorage = inject(UserStorage);

  protected listeningDataRecord = computed<UserPrivate['listeningData']['expandedHistory'] | null>(() => {
    const listeningData = this.userStorage.getUser()?.listeningData?.expandedHistory;
    return listeningData ? listeningData : null;
  });
  protected userExtendedDataLoaded = computed<boolean>(() => this.userStorage.userExtendedDataLoaded());
  protected loadingState = signal(LoadingStatusEnum.Idle);

  protected startingDate = signal<Date>(new Date(0));
  protected endingDate = signal<Date>(new Date());

  ngOnInit() {
    const startingDate = new Date(this.listeningDataRecord()?.startingDate || new Date(0));
    const endingDate = new Date(this.listeningDataRecord()?.endingDate || new Date());

    this.startingDate.set(startingDate);
    this.endingDate.set(endingDate);
  }
}
