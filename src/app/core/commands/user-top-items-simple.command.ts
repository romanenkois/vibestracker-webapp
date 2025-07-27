import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTopItemsSimpleStorage } from '@storage';
import { LoadingState, SimpleItemsSelection, SimpleTimeFrame } from '@types';
import { $appConfig } from '@environments';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationsService } from '@libs';

@Injectable({
  providedIn: 'root',
})
export class UserTopItemsSimpleCommand {
  private http: HttpClient = inject(HttpClient);
  private userTopItemsStorage: UserTopItemsSimpleStorage = inject(UserTopItemsSimpleStorage);
  private toastNotificationsService: ToastNotificationsService = inject(ToastNotificationsService);

  private readonly itemsPerLoad = 50;

  public loadInUserTopItems(params: {
    type: SimpleItemsSelection;
    timeFrame: SimpleTimeFrame;
  }): Observable<LoadingState> {
    return new Observable<LoadingState>((observer: any) => {
      observer.next('loading');

      if (this.userTopItemsStorage.getUserTopItems(params.timeFrame, params.type).length > 0) {
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
            this.userTopItemsStorage.setUserTopItems(response.items, params.timeFrame, params.type);
            observer.next('resolved');
            observer.complete();
            return;
          },
          error: (error: any) => {
            console.error('Error during loading:', error);
            this.toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Error',
              message: `Error during loading items: ${error.message}`,
              duration: 5000,
            });
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
            this.userTopItemsStorage.getUserTopItems(params.timeFrame, params.type).length
          }`,
        )
        .subscribe({
          next: (response: any) => {
            if (response.items.length === 0) {
              observer.next('all-resolved');
              observer.complete();
              return;
            }
            this.userTopItemsStorage.appendUserTopItems(response.items, params.timeFrame, params.type);
            observer.next('resolved');
            observer.complete();
            return;
          },
          error: (error: any) => {
            console.error('Error during loading:', error);
            this.toastNotificationsService.sendNotification({
              type: 'error',
              title: 'Error',
              message: `Error during loading more items: ${error.message}`,
              duration: 5000,
            });
            observer.next('error');
            observer.complete();
            return;
          },
        });
    });
  }
}
