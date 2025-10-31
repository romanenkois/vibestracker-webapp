import { ChangeDetectionStrategy, Component, HostListener, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserPreferencesCommand } from '@commands';
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
  private readonly _userPreferencesCommand = inject(UserPreferencesCommand);

  track = input.required<Track>();

  index = input<number>();
  userTrackStats = input<UserTrackStats>();

  showTrackMenu = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.showTrackMenu.set(false);
    }
  }

  protected ignoreTrack() {
    this._userPreferencesCommand.addIgnoredTrack({ trackId: this.track().id }).subscribe();
  }

  protected ignoreArtist() {
    this._userPreferencesCommand.addIgnoredArtist({ artistId: this.track().artists[0].id }).subscribe();
  }
}
