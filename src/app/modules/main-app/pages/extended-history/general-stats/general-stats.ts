import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TimeSimplePipe } from '@pipes';
import { UserPrivate } from '@types';

@Component({
  selector: 'app-general-stats',
  imports: [DatePipe, TimeSimplePipe, RouterLink],
  templateUrl: './general-stats.html',
  styleUrl: './general-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralStatsComponent {
  listeningStats = input.required<UserPrivate['listeningData']['expandedHistory'] | null>();
}
