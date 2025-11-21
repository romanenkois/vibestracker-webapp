import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorage } from '@storage';
import { LoadingStatusEnum, UserPrivate } from '@types';
import { ExtendedHistoryCommand } from '@commands';
import { LoadingSpinner } from '@features';
import { UserTopExtended } from './user-top-extended/user-top-extended';
import { GeneralStatsComponent } from "./general-stats/general-stats";
import { ExtendedHistoryFilter } from "./extended-history-filter/extended-history-filter";
@Component({
  selector: 'app-extended-history',
  imports: [RouterLink, UserTopExtended, LoadingSpinner, GeneralStatsComponent, ExtendedHistoryFilter],
  templateUrl: './extended-history.component.html',
  styleUrl: './extended-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExtendedHistoryComponent implements OnInit {
  private readonly userStorage = inject(UserStorage);
  private readonly extendedDataCommand = inject(ExtendedHistoryCommand);

  protected listeningDataRecord = computed<UserPrivate['listeningData']['expandedHistory'] | null>(() => {
    const listeningData = this.userStorage.getUser()?.listeningData?.expandedHistory;
    return listeningData ? listeningData : null;
  });
  protected userExtendedDataLoaded = computed<boolean>(() =>
    this.userStorage.userExtendedDataLoaded());
  protected loadingState = signal(LoadingStatusEnum.Idle);

  protected startingDate = signal<Date>(new Date(0));
  protected endingDate = signal<Date>(new Date());

  ngOnInit() {
    if (!this.userExtendedDataLoaded()) {
      const startingDate = new Date(
        this.listeningDataRecord()?.startingDate || new Date(0),
      )
      const endingDate = new Date(
        this.listeningDataRecord()?.endingDate || new Date(),
      );

      this.startingDate.set(startingDate);
      this.endingDate.set(endingDate);

      this.extendedDataCommand.loadExtendedHistory({ startingDate, endingDate }).subscribe((status) => {
        this.loadingState.set(status);
      });
    }
  }
}
