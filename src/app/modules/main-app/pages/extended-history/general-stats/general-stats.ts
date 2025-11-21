import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimeSimplePipe } from '@pipes';
import { UserPrivate } from '@types';

@Component({
  selector: 'app-general-stats',
  imports: [DatePipe, TimeSimplePipe, RouterLink],
  templateUrl: './general-stats.html',
  styleUrl: './general-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralStatsComponent {
  listeningStats: InputSignal<UserPrivate['listeningData']['expandedHistory'] | null> = input.required();
}
