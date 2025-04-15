import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorage, UserTopItemsSimpleStorage } from '@storage';
import { LoadingState, SimpleItemsSelection, SimpleTimeFrame } from '@types';
import { UserItemsApi } from '@api';

@Injectable({
  providedIn: 'root',
})
export class UserTopItemsSimpleCommand {
  private readonly userItemsApi: UserItemsApi = inject(UserItemsApi);
  private readonly tokenStorage: TokenStorage = inject(TokenStorage);
  private readonly userTopItemsStorage: UserTopItemsSimpleStorage = inject(
    UserTopItemsSimpleStorage
  );

  private readonly itemsPerLoad = 50;

  public loadInUserTopItems(params: {
    type: SimpleItemsSelection;
    timeFrame: SimpleTimeFrame;
  }): Observable<LoadingState> {
    return new Observable<LoadingState>((observer: any) => {
      observer.next('loading');

      // is to ensure, we dont load the same data again
      if (
        this.userTopItemsStorage.getUserTopItems(params.timeFrame, params.type)
          .length > 0
      ) {
        observer.next('resolved');
        observer.complete();
        return;
      }

      // check the token
      const token = this.tokenStorage.getToken();
      if (!token) {
        observer.next('error');
        observer.complete();
        return;
      }

      // load the data
      this.userItemsApi
        .getUserTopItemsSimple({
          type: params.type,
          timeFrame: params.timeFrame,
          limit: this.itemsPerLoad,
          offset: 0,
          token: token,
        })
        .subscribe({
          next: (response: any) => {
            this.userTopItemsStorage.setUserTopItems(
              response.items,
              params.timeFrame,
              params.type
            );
            observer.next('resolved');
            observer.complete();
          },
          error: (error: any) => {
            console.error('Error during loading:', error);
            observer.next('error');
            observer.complete();
          },
        });
    });
  }

  public loadInMoreUserTopItems(params: {
    type: 'artists' | 'tracks';
    timeFrame: SimpleTimeFrame;
  }): Observable<LoadingState> {
    return new Observable<LoadingState>((observer: any) => {
      observer.next('loading');

      const token = this.tokenStorage.getToken();
      if (!token) {
        observer.next('error');
        observer.complete();
        return;
      }

      this.userItemsApi
        .getUserTopItemsSimple({
          type: params.type,
          timeFrame: params.timeFrame,
          limit: this.itemsPerLoad,
          offset: this.userTopItemsStorage.getUserTopItems(
            params.timeFrame,
            params.type
          ).length,
          token: token,
        })
        .subscribe({
          next: (response: any) => {
            this.userTopItemsStorage.appendUserTopItems(
              response.items,
              params.timeFrame,
              params.type
            );
            observer.next('resolved');
            observer.complete();
          },
          error: (error: any) => {
            console.error('Error during loading:', error);
            observer.next('error');
            observer.complete();
          },
        });
    });
  }
}
