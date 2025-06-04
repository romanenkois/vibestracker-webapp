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

      const idsToLoad: string[] = ids.filter(
        (id) => !this.spotifyItemsStorage.getAlbum(id),
      );
      if (idsToLoad.length === 0) {
        observer.next('resolved');
        observer.complete();
        return;
      }

      this.spotifyItemsApi.getAlbums(idsToLoad).subscribe({
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

      const idsToLoad: string[] = ids.filter(
        (id) => !this.spotifyItemsStorage.getArtist(id),
      );
      if (idsToLoad.length === 0) {
        observer.next('resolved');
        observer.complete();
        return;
      }

      this.spotifyItemsApi.getArtists(idsToLoad).subscribe({
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

      const idsToLoad: string[] = ids.filter(
        (id) => !this.spotifyItemsStorage.getTrack(id),
      );
      if (idsToLoad.length === 0) {
        observer.next('resolved');
        observer.complete();
        return;
      }

      this.spotifyItemsApi.getTracks(idsToLoad).subscribe({
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
