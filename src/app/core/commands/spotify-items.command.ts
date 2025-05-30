import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyItemsStorage } from '@storage';
import { LoadingState } from '@types';
import { SpotifyItemsApi } from '@api';

@Injectable({
  providedIn: 'root',
})
export class SpotifyItemsCommand {
  private spotifyItemsApi: SpotifyItemsApi = inject(SpotifyItemsApi);
  private spotifyItemsStorage: SpotifyItemsStorage =
    inject(SpotifyItemsStorage);

  public loadAlbums(ids: string[]): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

      this.spotifyItemsApi.getAlbums(ids).subscribe({
        next: (response) => {
          this.spotifyItemsStorage.appendAlbums(response.albums);
          observer.next('resolved');
          observer.complete();
        },
        error: (error) => {
          console.error('Error loading albums:', error);
          observer.next('error');
          observer.complete();
        },
      });
    });
  }

  loadArtists(ids: string[]): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');
      this.spotifyItemsApi.getArtists(ids).subscribe({
        next: (response) => {
          this.spotifyItemsStorage.appendArtists(response.artists);
          observer.next('resolved');
          observer.complete();
        },
        error: (error) => {
          console.error('Error loading artists:', error);
          observer.next('error');
          observer.complete();
        },
      });
    });
  }

  public loadTracks(ids: string[]): Observable<LoadingState> {
    return new Observable<LoadingState>((observer) => {
      observer.next('loading');

      this.spotifyItemsApi.getTracks(ids).subscribe({
        next: (response) => {
          this.spotifyItemsStorage.appendTracks(response.tracks);
          observer.next('resolved');
          observer.complete();
        },
        error: (error) => {
          console.error('Error loading tracks:', error);
          observer.next('error');
          observer.complete();
        },
      });
    });
  }
}
