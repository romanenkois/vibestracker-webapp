import { Injectable, signal, WritableSignal } from '@angular/core';
import { RefinedExtendedStreamingHistory, LoadingState } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserExtandedDataStorage {
  private readonly userExtendedData: WritableSignal<RefinedExtendedStreamingHistory> =
    signal([]);

  public readonly userExtendedDataLoadingState: WritableSignal<LoadingState> =
    signal('idle');
  public readonly deletingUserExtendedDataLoadingState: WritableSignal<LoadingState> =
    signal('idle');

  public getUserExtendedData(): RefinedExtendedStreamingHistory {
    return this.userExtendedData();
  }
  public setUserExtendedData(data: RefinedExtendedStreamingHistory): void {
    this.userExtendedData.set(data);
  }
}
