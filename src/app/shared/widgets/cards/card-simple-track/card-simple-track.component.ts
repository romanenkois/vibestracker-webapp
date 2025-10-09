import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserCommand } from '@commands';
import { TimeSimplePipe } from '@pipes';
import { Track } from '@types';

export interface UserTrackStats {
  timeListened?: number;
  timesPlayed?: number;
}

@Component({
  selector: 'app-card-simple-track',
  standalone: true,
  imports: [RouterLink, TimeSimplePipe],
  templateUrl: './card-simple-track.component.html',
  styleUrl: './card-simple-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSimpleTrackComponent {
  private userCommand: UserCommand = inject(UserCommand);

  track = input.required<Track>();

  index = input<number>();
  userTrackStats = input<UserTrackStats>();

  showTrackMenu: WritableSignal<boolean> = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.showTrackMenu.set(false);
    }
  }

  ignoreTrack() {
    this.userCommand.addIgnoredTrack(this.track().id);
  }
}
