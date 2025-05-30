import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { $appConfig } from '@environments';
@Injectable({
  providedIn: 'root',
})
export class SpotifyItemsApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = $appConfig.api.BASE_API_URL;

  public getAlbums(ids: string[]): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/spotify/albums?ids=${ids.join(',')}`,
    );
  }

  public getArtists(ids: string[]): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/spotify/artists?ids=${ids.join(',')}`,
    );
  }

  public getTracks(ids: string[]): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/spotify/tracks?ids=${ids.join(',')}`,
    );
  }
}
