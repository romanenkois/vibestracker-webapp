import { Component, HostListener, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserCommand } from '@commands';
import { TimeSimplePipe } from '@pipes';
import { LoadingState, Track } from '@types';

@Component({
  selector: 'app-card-simple-track',
  standalone: true,
  imports: [RouterLink, TimeSimplePipe],
  templateUrl: './card-simple-track.component.html',
  styleUrl: './card-simple-track.component.scss',
})
export class CardSimpleTrackComponent {
  private userCommand: UserCommand = inject(UserCommand);

  track: InputSignal<Track> = input.required<Track>();
  index: InputSignal<number> = input.required<number>();

  timeListened: InputSignal<number> = input<number>(0);
  timesPlayed: InputSignal<number> = input<number>(0);

  // used when stuff happends
  ignoringThisTrack: WritableSignal<boolean> = signal<boolean>(false);
  showTrackMenu: WritableSignal<boolean> = signal<boolean>(false);


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.showTrackMenu.set(false);
    }
  }

  ignoreTrack() {
    this.ignoringThisTrack.set(true);
    this.userCommand
      .addIgnoredTrack(this.track().id);
  }
}
