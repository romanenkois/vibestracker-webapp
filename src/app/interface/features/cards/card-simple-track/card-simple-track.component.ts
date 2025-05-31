import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimeSimplePipe } from '@pipes';
import { Track } from '@types';

@Component({
  selector: 'app-card-simple-track',
  standalone: true,
  imports: [RouterLink, TimeSimplePipe],
  templateUrl: './card-simple-track.component.html',
  styleUrl: './card-simple-track.component.scss',
})
export class CardSimpleTrackComponent {
  track: InputSignal<Track> = input.required<Track>();
  index: InputSignal<number> = input.required<number>();

  timeListened: InputSignal<number> = input<number>(0);
  timesPlayed: InputSignal<number> = input<number>(0);
}
