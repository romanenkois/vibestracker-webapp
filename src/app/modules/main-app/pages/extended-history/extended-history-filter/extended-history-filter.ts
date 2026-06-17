import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DatePickerModule } from 'primeng/datepicker';

import { TimeSimplePipe } from '@pipes';
import { AnalysisUserExtendedHistoryUnionType, ItemsSelectionEnum } from '@types';

@Component({
  selector: 'app-extended-history-filter',
  imports: [ TimeSimplePipe, DatePickerModule, FormsModule],
  templateUrl: './extended-history-filter.html',
  styleUrls: ['./extended-history-filter.scss'],
})
export class ExtendedHistoryFilter {
  private readonly _router = inject(Router);

  userTopTracksAnalysis = input.required<AnalysisUserExtendedHistoryUnionType | null>();
  minDate = input.required<Date>();
  maxDate = input.required<Date>();
  selectedItemsType = input.required<ItemsSelectionEnum>();

  protected readonly itemsTypeOptions: { label: string; value: ItemsSelectionEnum }[] = [
    { label: 'Tracks', value: ItemsSelectionEnum.Tracks },
    { label: 'Albums', value: ItemsSelectionEnum.Albums },
    { label: 'Artists', value: ItemsSelectionEnum.Artists },
  ];

  // userChangesDates = signal<boolean>(false);
  rangeDates = signal<Date[] | null>(null);

  constructor() {
    effect(() => {
      const dates = this.rangeDates();
      if (dates && dates.length === 2 && dates[0] && dates[1]) {
        //
        this._router.navigate([], {
          queryParams: {
            'start-date': dates[0] ? dates[0].toISOString().split('T')[0] : null,
            'end-date': dates[1] ? dates[1].toISOString().split('T')[0] : null,
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  protected selectItemsType(itemsType: ItemsSelectionEnum) {
    this._router.navigate([], {
      queryParams: {
        'items-type': itemsType,
      },
      queryParamsHandling: 'merge',
    });
  }

  protected resetFilter() {
    this.rangeDates.set(null);

    this._router.navigate([], {
      queryParams: {
        'start-date': null,
        'end-date': null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
