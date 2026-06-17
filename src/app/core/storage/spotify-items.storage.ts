import { Injectable, WritableSignal, signal } from '@angular/core';

import { Album, Artist, Track } from '@types';

@Injectable({
  providedIn: 'root',
})
export class SpotifyItemsStorage {
  private readonly tracks: WritableSignal<Track[]> = signal([]);

  public getTrack(id: Track['id']): Track | null {
    return this.tracks().find((track) => track.id === id) || null;
  }
  public getTracks(ids: Track['id'][]): Track[] {
    return this.tracks().filter((track) => ids.includes(track.id));
  }
  public appendTracks(newTracks: Track[]): void {
    const currentTracks = this.tracks();
    const existingTrackIds = new Set(currentTracks.map((track) => track.id));
    const newTracksFiltered = newTracks.filter((track) => !existingTrackIds.has(track.id));
    this.tracks.set([...currentTracks, ...newTracksFiltered]);
  }

  private readonly artists: WritableSignal<Artist[]> = signal([]);

  public getArtist(id: Artist['id']): Artist | null {
    return this.artists().find((artist) => artist.id === id) || null;
  }
  public getArtists(ids: Artist['id'][]): Artist[] {
    return this.artists().filter((artist) => ids.includes(artist.id));
  }
  public appendArtists(newArtists: Artist[]): void {
    const currentArtists = this.artists();
    const updatedArtists = [...currentArtists, ...newArtists];
    this.artists.set(updatedArtists);
  }

  private readonly albums: WritableSignal<Album[]> = signal([]);

  public getAlbum(id: Album['id']): Album | null {
    return this.albums().find((album) => album.id === id) || null;
  }
  public getAlbums(ids: Album['id'][]): Album[] {
    return this.albums().filter((album) => ids.includes(album.id));
  }
  public appendAlbums(newAlbums: Album[]): void {
    const currentAlbums = this.albums();
    const updatedAlbums = [...currentAlbums, ...newAlbums];
    this.albums.set(updatedAlbums);
  }
}
