import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorage } from '@storage';
import { UserTopExtended } from '../../widgets/user-top-extended/user-top-extended';
import { LoadingState, UserPrivate } from '@types';
import { ExtendedHistoryCommand } from '@commands';
import { ExtendedHistoryService } from '@services';
import { LoadingSpinner } from "../../features/loading-spinner/loading-spinner";
@Component({
  selector: 'app-extended-history',
  imports: [RouterLink, DatePipe, UserTopExtended, LoadingSpinner],
  templateUrl: './extended-history.component.html',
  styleUrl: './extended-history.component.scss',
})
export default class ExtendedHistoryComponent implements OnInit {
  private readonly userStorage: UserStorage = inject(UserStorage);
  private readonly extendedHistoryService: ExtendedHistoryService = inject(
    ExtendedHistoryService,
  );
  private extendedDataCommand: ExtendedHistoryCommand = inject(
    ExtendedHistoryCommand,
  );

  listeningData: Signal<UserPrivate['listeningData'][0] | null> = computed(() => {
    console.log('Fetching listening data...');

    const user = this.userStorage.getUser();

    const listeningData = user?.listeningData?.find(
      (data) => data.type === 'expanded-history',
    );

    return listeningData ? listeningData : null;
  });

  extendedDataIsLoaded = computed(() => this.extendedHistoryService.userExtendedData().length > 0);

  ngOnInit() {
    this.extendedDataCommand
      .loadExtendedHistory()
      .subscribe((loadingState: LoadingState) => { console.log('Extended history loading state:', loadingState); });
  }
}
