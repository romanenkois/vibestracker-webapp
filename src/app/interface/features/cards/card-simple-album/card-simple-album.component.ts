import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Album } from '@types';

@Component({
  selector: 'app-card-simple-album',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './card-simple-album.component.html',
  styleUrl: './card-simple-album.component.scss'
})
export class CardSimpleAlbumComponent {
  album: InputSignal<Album> = input.required<Album>();
  index: InputSignal<number> = input.required<number>();
}
