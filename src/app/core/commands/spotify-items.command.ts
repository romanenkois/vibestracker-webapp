import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyItemsStorage } from '@storage';
import { LoadingStatusEnum } from '@types';
import { HttpClient } from '@angular/common/http';
import { $appConfig } from '@environments';

@Injectable({
  providedIn: 'root',
})
export class SpotifyItemsCommand {
  private http: HttpClient = inject(HttpClient);
  private spotifyItemsStorage: SpotifyItemsStorage =
    inject(SpotifyItemsStorage);

  public loadAlbums(ids: string[]): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      const idsToLoad: string[] = ids.filter(
        (id) => !this.spotifyItemsStorage.getAlbum(id),
      );
      if (idsToLoad.length === 0) {
        observer.next(LoadingStatusEnum.Resolved);
        observer.complete();
        return;
      }

      this.http
        .get<any>(
          `${$appConfig.api.BASE_API_URL}/spotify/albums?ids=${idsToLoad.join(',')}`,
        )
        .subscribe({
          next: (response) => {
            this.spotifyItemsStorage.appendAlbums(response.albums);
            observer.next(LoadingStatusEnum.Resolved);
            observer.complete();
          },
          error: (error) => {
            console.error('Error loading albums:', error);
            observer.next(LoadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  loadArtists(ids: string[]): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      const idsToLoad: string[] = ids.filter(
        (id) => !this.spotifyItemsStorage.getArtist(id),
      );
      if (idsToLoad.length === 0) {
        observer.next(LoadingStatusEnum.Resolved);
        observer.complete();
        return;
      }

      this.http
        .get<any>(
          `${$appConfig.api.BASE_API_URL}/spotify/artists?ids=${idsToLoad.join(',')}`,
        )
        .subscribe({
          next: (response) => {
            this.spotifyItemsStorage.appendArtists(response.artists);
            observer.next(LoadingStatusEnum.Resolved);
            observer.complete();
          },
          error: (error) => {
            console.error('Error loading artists:', error);
            observer.next(LoadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }

  public loadTracks(ids: string[]): Observable<LoadingStatusEnum> {
    return new Observable<LoadingStatusEnum>((observer) => {
      observer.next(LoadingStatusEnum.Loading);

      const idsToLoad: string[] = ids.filter(
        (id) => !this.spotifyItemsStorage.getTrack(id),
      );
      if (idsToLoad.length === 0) {
        observer.next(LoadingStatusEnum.Resolved);
        observer.complete();
        return;
      }

      this.http
        .get<any>(
          `${$appConfig.api.BASE_API_URL}/spotify/tracks?ids=${idsToLoad.join(',')}`,
        )
        .subscribe({
          next: (response) => {
            this.spotifyItemsStorage.appendTracks(response.tracks);
            observer.next(LoadingStatusEnum.Resolved);
            observer.complete();
          },
          error: (error) => {
            console.error('Error loading tracks:', error);
            observer.next(LoadingStatusEnum.Error);
            observer.complete();
          },
        });
    });
  }
}
