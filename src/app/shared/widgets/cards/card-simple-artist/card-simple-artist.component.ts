import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Artist } from '@types';

@Component({
  selector: 'app-card-simple-artist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-simple-artist.component.html',
  styleUrl: './card-simple-artist.component.scss'
})
export class CardSimpleArtistComponent {
  artist: InputSignal<Artist> = input.required<Artist>();
  index: InputSignal<number> = input.required<number>();
}
