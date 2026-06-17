import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimeSimplePipe, TranslatePipe } from '@pipes';
import { Artist } from '@types';

export interface UserArtistStats {
  msPlayed?: number;
  timesPlayed?: number;
}

@Component({
  selector: 'app-card-simple-artist',
  standalone: true,
  imports: [RouterLink, TimeSimplePipe, TranslatePipe],
  templateUrl: './card-simple-artist.component.html',
  styleUrl: './card-simple-artist.component.scss'
})
export class CardSimpleArtistComponent {
  artist: InputSignal<Artist> = input.required<Artist>();
  index: InputSignal<number> = input.required<number>();
  userArtistStats = input<UserArtistStats>();
}
