import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorage } from '@storage';
import { LoadingState, UserPrivate } from '@types';
import { ExtendedHistoryCommand } from '@commands';
import { LoadingSpinner } from '@features';
import { TimeSimplePipe } from '@pipes';
import { UserTopExtended } from './user-top-extended/user-top-extended';
@Component({
  selector: 'app-extended-history',
  imports: [RouterLink, DatePipe, UserTopExtended, LoadingSpinner, TimeSimplePipe],
  templateUrl: './extended-history.component.html',
  styleUrl: './extended-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExtendedHistoryComponent implements OnInit {
  private readonly userStorage: UserStorage = inject(UserStorage);
  private readonly extendedDataCommand: ExtendedHistoryCommand = inject(ExtendedHistoryCommand);

  protected listeningDataRecord: Signal<UserPrivate['listeningData']['expandedHistory'] | null> = computed(() => {
    console.log('user lisllasllalasda', this.userStorage.getUser());
    const listeningData = this.userStorage.getUser()?.listeningData?.expandedHistory;
    return listeningData ? listeningData : null;
  });

  protected userExtendedDataLoaded: Signal<boolean> = computed(() => {
    return this.userStorage.userExtendedDataLoaded();
  });
  protected loadingState: WritableSignal<LoadingState> = signal('idle');

  ngOnInit() {
    if (!this.userExtendedDataLoaded()) {
      const startingDate: Date = new Date(
        this.userStorage.getUser()?.listeningData?.expandedHistory?.startingDate || 0,
      );
      const endingDate: Date = new Date(
        this.userStorage.getUser()?.listeningData?.expandedHistory?.endingDate || Date.now(),
      );
      this.extendedDataCommand.loadExtendedHistory({ startingDate, endingDate }).subscribe((status: LoadingState) => {
        this.loadingState.set(status);
      });
    }
  }
}
