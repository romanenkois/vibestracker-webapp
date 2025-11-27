import { DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';

import { TimeSimplePipe } from '@pipes';
import { TracksAnalysisUserExtendedHistory } from '@types';

@Component({
  selector: 'app-extended-history-filter',
  imports: [DatePipe, TimeSimplePipe],
  templateUrl: './extended-history-filter.html',
  styleUrl: './extended-history-filter.scss',
})
export class ExtendedHistoryFilter {
  userTopTracksAnalysis = input.required<TracksAnalysisUserExtendedHistory | null>();

  userChangesDates = signal<boolean>(false);

  protected resetFilter() {
//
  }
}
