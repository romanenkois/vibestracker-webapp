import { inject, Injectable } from '@angular/core';
import { UserStorage } from '@storage';
import { Track } from '@types';
import { HttpClient } from '@angular/common/http';
import { $appConfig } from '@environments';

@Injectable({
  providedIn: 'root',
})
export class UserCommand {
  private http: HttpClient = inject(HttpClient);

  private userStorage: UserStorage = inject(UserStorage);

  public loadUser() {
    this.http.get(`${$appConfig.api.BASE_API_URL}/user-private`).subscribe({
      next: (response: any) => {
        if (response.user) {
          this.userStorage.setUser(response.user);
          this.userStorage.userLoadingState.set('resolved');
        } else {
          console.error('Invalid response from user load:', response);
          this.userStorage.userLoadingState.set('error');
        }
      },
      error: (error: any) => {
        console.error('Error during user load:', error);
        this.userStorage.userLoadingState.set('error');
      },
    });
  }

  public addIgnoredTrack(trackId: Track['id']) {
    this.userStorage.userLoadingState.set('reloading');

    this.http
      .patch(`${$appConfig.api.BASE_API_URL}/user-ignore-track`, {
        trackId,
      })
      .subscribe({
        next: (response: any) => {
          if (response.user) {
            this.userStorage.setUser(response.user);
            this.userStorage.userLoadingState.set('resolved');
          } else {
            console.error('Invalid response from add ignored track:', response);
            this.userStorage.userLoadingState.set('resolved');
          }
        },
        error: (error: any) => {
          console.error('Error during add ignored track:', error);
          this.userStorage.userLoadingState.set('resolved');
        },
      });
  }

  public clearIgnoredTracks() {
    this.userStorage.userLoadingState.set('reloading');

    this.http
      .delete(`${$appConfig.api.BASE_API_URL}/user-ignored-tracks`)
      .subscribe({
        next: (response: any) => {
          if (response.user) {
            this.userStorage.setUser(response.user);
            this.userStorage.userLoadingState.set('resolved');
          } else {
            console.error(
              'Invalid response from clear ignored tracks:',
              response,
            );
            this.userStorage.userLoadingState.set('resolved');
          }
        },
        error: (error: any) => {
          console.error('Error during clear ignored tracks:', error);
          this.userStorage.userLoadingState.set('resolved');
        },
      });
  }
}
