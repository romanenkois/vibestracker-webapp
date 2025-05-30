import { Injectable, signal, WritableSignal } from '@angular/core';
import { Album, Artist, Track } from '@types';

@Injectable({
  providedIn: 'root',
})
export class SpotifyItemsStorage {
  private readonly tracks: WritableSignal<Track[]> = signal([]);

  public getTrack(id: Track['id']): Track | null {
    return this.tracks().find((track) => track.id === id) || null;
  }
  public appendTracks(newTracks: Track[]): void {
    const currentTracks = this.tracks();
    const updatedTracks = [...currentTracks, ...newTracks];
    this.tracks.set(updatedTracks);
  }

  private readonly artists: WritableSignal<Artist[]> = signal([]);

  public getArtist(id: Artist['id']): Artist | null {
    return this.artists().find((artist) => artist.id === id) || null;
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
  public appendAlbums(newAlbums: Album[]): void {
    const currentAlbums = this.albums();
    const updatedAlbums = [...currentAlbums, ...newAlbums];
    this.albums.set(updatedAlbums);
  }
}
