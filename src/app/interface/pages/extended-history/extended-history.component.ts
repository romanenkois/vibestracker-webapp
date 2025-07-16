import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserExtandedDataStorage, UserStorage } from '@storage';
import { UserTopExtended } from '../../widgets/user-top-extended/user-top-extended';
import { UserPrivate } from '@types';
import { ExtendedHistoryCommand } from '@commands';
import { LoadingSpinner } from '../../features/loading-spinner/loading-spinner';
import { TimeSimplePipe } from '@pipes';
@Component({
  selector: 'app-extended-history',
  imports: [RouterLink, DatePipe, UserTopExtended, LoadingSpinner, TimeSimplePipe],
  templateUrl: './extended-history.component.html',
  styleUrl: './extended-history.component.scss',
})
export default class ExtendedHistoryComponent implements OnInit {
  private readonly userStorage: UserStorage = inject(UserStorage);
  private extendedDataCommand: ExtendedHistoryCommand = inject(
    ExtendedHistoryCommand,
  );
  private readonly userExtandedDataStorage: UserExtandedDataStorage = inject(
    UserExtandedDataStorage,
  );

  listeningData: Signal<UserPrivate['listeningData'][0] | null> = computed(
    () => {
      console.log('user', this.userStorage
        .getUser())

      const listeningData = this.userStorage
        .getUser()
        ?.listeningData?.find((data) => data.type === 'expanded-history');

      return listeningData ? listeningData : null;
    },
  );

  userExtendedDataLoadingState = computed(() => {
    return this.userExtandedDataStorage.userExtendedDataLoadingState();
  });

  ngOnInit() {
    console.log('11', this.listeningData());
    this.extendedDataCommand.loadExtendedHistory();
  }
}
