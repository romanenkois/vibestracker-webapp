import { Injectable, signal } from '@angular/core';
import {
  Track,
  Artist,
  Album,
  SimpleTimeFrame,
  UserTopItemsSimpleStorageType,
  Genre,
  SimpleItemsSelection,
} from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserTopItemsSimpleStorage {
  // routing function, to simplify dependency code a little
  public getUserTopItems<T>(
    term: SimpleTimeFrame,
    type: SimpleItemsSelection,
  ): Array<T> {
    switch (type) {
      case 'albums':
        return this.getUserTopAlbums(term) as Array<T>;
      case 'artists':
        return this.getUserTopArtists(term) as Array<T>;
      case 'tracks':
        return this.getUserTopTracks(term) as Array<T>;
      case 'genres':
        return this.getUserTopGenres(term) as Array<T>;
      default:
        return [];
    }
  }

  public setUserTopItems<T>(
    items: Array<T>,
    term: SimpleTimeFrame,
    type: SimpleItemsSelection,
  ): void {
    switch (type) {
      case 'albums':
        this.setUserTopAlbums(items as Array<Album>, term);
        break;
      case 'artists':
        this.setUserTopArtists(items as Array<Artist>, term);
        break;
      case 'tracks':
        this.setUserTopTracks(items as Array<Track>, term);
        break;
      case 'genres':
        this.setUserTopGenres(items as Array<any>, term);
        break;
      default:
        break;
    }
  }

  public appendUserTopItems<T>(
    items: Array<T>,
    term: SimpleTimeFrame,
    type: 'artists' | 'tracks',
  ): void {
    switch (type) {
      case 'artists':
        this.appendUserTopArtists(items as Array<Artist>, term);
        break;
      case 'tracks':
        this.appendUserTopTracks(items as Array<Track>, term);
        break;
      default:
        break;
    }
  }

  /*
  _    _  _____ ______ _____    _______ ____  _____    _______ _____            _____ _  __ _____
 | |  | |/ ____|  ____|  __ \  |__   __/ __ \|  __ \  |__   __|  __ \     /\   / ____| |/ // ____|
 | |  | | (___ | |__  | |__) |    | | | |  | | |__) |    | |  | |__) |   /  \ | |    | ' /| (___
 | |  | |\___ \|  __| |  _  /     | | | |  | |  ___/     | |  |  _  /   / /\ \| |    |  <  \___ \
 | |__| |____) | |____| | \ \     | | | |__| | |         | |  | | \ \  / ____ \ |____| . \ ____) |
  \____/|_____/|______|_|  \_\    |_|  \____/|_|         |_|  |_|  \_\/_/    \_\_____|_|\_\_____/

  */
  private readonly userTopTracks: UserTopItemsSimpleStorageType<Track> = signal(
    {},
  );
  public setUserTopTracks(tracks: Array<Track>, term: SimpleTimeFrame): void {
    this.userTopTracks.set({
      ...this.userTopTracks(),
      [term]: tracks,
    });
  }
  public appendUserTopTracks(
    tracks: Array<Track>,
    term: SimpleTimeFrame,
  ): void {
    this.userTopTracks.set({
      ...this.userTopTracks(),
      [term]: [...(this.getUserTopTracks(term) || []), ...tracks],
    });
  }
  public getUserTopTracks(term: SimpleTimeFrame): Array<Track> {
    return this.userTopTracks()[term] || [];
  }

  /*
  _    _  _____ ______ _____    _______ ____  _____             _____ _______ _____  _____ _______ _____
 | |  | |/ ____|  ____|  __ \  |__   __/ __ \|  __ \      /\   |  __ \__   __|_   _|/ ____|__   __/ ____|
 | |  | | (___ | |__  | |__) |    | | | |  | | |__) |    /  \  | |__) | | |    | | | (___    | | | (___
 | |  | |\___ \|  __| |  _  /     | | | |  | |  ___/    / /\ \ |  _  /  | |    | |  \___ \   | |  \___ \
 | |__| |____) | |____| | \ \     | | | |__| | |       / ____ \| | \ \  | |   _| |_ ____) |  | |  ____) |
  \____/|_____/|______|_|  \_\    |_|  \____/|_|      /_/    \_\_|  \_\ |_|  |_____|_____/   |_| |_____/

  */
  private readonly userTopArtists: UserTopItemsSimpleStorageType<Artist> =
    signal({});
  public setUserTopArtists(
    artists: Array<Artist>,
    term: SimpleTimeFrame,
  ): void {
    this.userTopArtists.set({
      ...this.userTopArtists(),
      [term]: artists,
    });
  }
  public appendUserTopArtists(
    artists: Array<Artist>,
    term: SimpleTimeFrame,
  ): void {
    this.userTopArtists.set({
      ...this.userTopArtists(),
      [term]: [...(this.getUserTopArtists(term) || []), ...artists],
    });
  }
  public getUserTopArtists(term: SimpleTimeFrame): Array<Artist> {
    return this.userTopArtists()[term] || [];
  }

  /*
  _    _  _____ ______ _____    _______ ____  _____             _      __  __ _    _ __  __  _____
 | |  | |/ ____|  ____|  __ \  |__   __/ __ \|  __ \      /\   | |    |  \/  | |  | |  \/  |/ ____|
 | |  | | (___ | |__  | |__) |    | | | |  | | |__) |    /  \  | |    | \  / | |  | | \  / | (___
 | |  | |\___ \|  __| |  _  /     | | | |  | |  ___/    / /\ \ | |    | |\/| | |  | | |\/| |\___ \
 | |__| |____) | |____| | \ \     | | | |__| | |       / ____ \| |____| |  | | |__| | |  | |____) |
  \____/|_____/|______|_|  \_\    |_|  \____/|_|      /_/    \_\______|_|  |_|\____/|_|  |_|_____/

  */
  private readonly userTopAlbums: UserTopItemsSimpleStorageType<Album> = signal(
    {},
  );
  public setUserTopAlbums(albums: Array<Album>, term: SimpleTimeFrame): void {
    this.userTopAlbums.set({
      ...this.userTopAlbums(),
      [term]: albums,
    });
  }
  public getUserTopAlbums(term: SimpleTimeFrame): Array<Album> {
    return this.userTopAlbums()[term] || [];
  }

  /*
  _    _  _____ ______ _____    _______ ____  _____     _____ ______ _   _ _____  ______  _____
 | |  | |/ ____|  ____|  __ \  |__   __/ __ \|  __ \   / ____|  ____| \ | |  __ \|  ____|/ ____|
 | |  | | (___ | |__  | |__) |    | | | |  | | |__) | | |  __| |__  |  \| | |__) | |__  | (___
 | |  | |\___ \|  __| |  _  /     | | | |  | |  ___/  | | |_ |  __| | . ` |  _  /|  __|  \___ \
 | |__| |____) | |____| | \ \     | | | |__| | |      | |__| | |____| |\  | | \ \| |____ ____) |
  \____/|_____/|______|_|  \_\    |_|  \____/|_|       \_____|______|_| \_|_|  \_\______|_____/

  */
  private readonly userTopGenres: UserTopItemsSimpleStorageType<Genre> = signal(
    {},
  );
  public setUserTopGenres(data: Array<any>, term: SimpleTimeFrame) {
    this.userTopGenres.set({
      ...this.userTopGenres(),
      [term]: data,
    });
  }
  public getUserTopGenres(term: SimpleTimeFrame): Array<any> {
    if ((this.userTopGenres()[term] || []).length > 0) {
      return this.userTopGenres()[term] || [];
    }
    return [];
  }
}
