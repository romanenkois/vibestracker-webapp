import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTopItemsSimpleStorage } from '@storage';
import { LoadingState, SimpleItemsSelection, SimpleTimeFrame } from '@types';
import { $appConfig } from '@environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserTopItemsSimpleCommand {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly userTopItemsStorage: UserTopItemsSimpleStorage = inject(
    UserTopItemsSimpleStorage,
  );

  private readonly itemsPerLoad = 50;

  public loadInUserTopItems(params: {
    type: SimpleItemsSelection;
    timeFrame: SimpleTimeFrame;
  }): Observable<LoadingState> {
    return new Observable<LoadingState>((observer: any) => {
      observer.next('loading');

      if (
        this.userTopItemsStorage.getUserTopItems(params.timeFrame, params.type)
          .length > 0
      ) {
        observer.next('resolved');
        observer.complete();
        return;
      }

      this.http
        .get(
          `${$appConfig.api.BASE_API_URL}/top-items?type=${params.type}&timeFrame=${params.timeFrame}&limit=${this.itemsPerLoad}&offset=0`,
        )
        .subscribe({
          next: (response: any) => {
            if (response.items.length === 0) {
              observer.next('all-resolved');
              observer.complete();
              return;
            }
            this.userTopItemsStorage.setUserTopItems(
              response.items,
              params.timeFrame,
              params.type,
            );
            observer.next('resolved');
            observer.complete();
            return;
          },
          error: (error: any) => {
            console.error('Error during loading:', error);
            window.alert(`Error during loading items.\n${error}`);
            observer.next('error');
            observer.complete();
            return;
          },
        });
    });
  }

  public loadInMoreUserTopItems(params: {
    type: 'artists' | 'tracks';
    timeFrame: SimpleTimeFrame;
  }): Observable<LoadingState> {
    return new Observable<LoadingState>((observer: any) => {
      observer.next('appending');

      this.http
        .get(
          `${$appConfig.api.BASE_API_URL}/top-items?type=${params.type}&timeFrame=${params.timeFrame}&limit=${this.itemsPerLoad}&offset=${
            this.userTopItemsStorage.getUserTopItems(
              params.timeFrame,
              params.type,
            ).length
          }`,
        )
        .subscribe({
          next: (response: any) => {
            if (response.items.length === 0) {
              observer.next('all-resolved');
              observer.complete();
              return;
            }
            this.userTopItemsStorage.appendUserTopItems(
              response.items,
              params.timeFrame,
              params.type,
            );
            observer.next('resolved');
            observer.complete();
            return;
          },
          error: (error: any) => {
            console.error('Error during loading:', error);
            window.alert(`Error during loading more items.\n${error}`);
            observer.next('error');
            observer.complete();
            return;
          },
        });
    });
  }
}
