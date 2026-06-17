import { computed, Injectable, signal } from '@angular/core';

import { Artist, Track } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesStorage {
  // #region User Ignored Tracks

  private _userIgnoredTracks = signal<Track['id'][]>([]);

  public userIgnoredTracks = computed(() => this._userIgnoredTracks());
  public setUserIgnoredTracks(ignoredTracks: Track['id'][]) {
    this._userIgnoredTracks.set(ignoredTracks);
  }
  public addUserIgnoredTrack(trackId: Track['id']) {
    this._userIgnoredTracks.set([...this._userIgnoredTracks(), trackId]);
  }
  public removeUserIgnoredTrack(trackId: Track['id']) {
    this._userIgnoredTracks.set(this._userIgnoredTracks().filter((id) => id !== trackId));
  }

  // #endregion User Ignored Tracks

  // #region User Ignored Artists

  private _userIgnoredArtists = signal<Artist['id'][]>([]);

  public userIgnoredArtists = computed(() => this._userIgnoredArtists());
  public setUserIgnoredArtists(ignoredArtists: Artist['id'][]) {
    this._userIgnoredArtists.set(ignoredArtists);
  }
  public addUserIgnoredArtist(artistId: Artist['id']) {
    this._userIgnoredArtists.set([...this._userIgnoredArtists(), artistId]);
  }
  public removeUserIgnoredArtist(artistId: Artist['id']) {
    this._userIgnoredArtists.set(this._userIgnoredArtists().filter((id) => id !== artistId));
  }

  // #endregion User Ignored Artists
}
