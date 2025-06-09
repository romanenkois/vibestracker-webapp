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

    const user = this.userStorage.getUser();
    if (!user) return;

    this.userStorage.setUser({
      ...user,
      ignoredTracks: [...(user.ignoredTracks || []), trackId],
    });

    this.http
      .patch(`${$appConfig.api.BASE_API_URL}/user-ignore-track`, {
        trackId,
      })
      .subscribe({
        next: (response: any) => {
          if (response.user) {
            // this.userStorage.setUser(response.user);
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
}
