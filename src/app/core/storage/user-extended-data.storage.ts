import { Injectable, signal, WritableSignal } from '@angular/core';
import { RefinedExtendedStreamingHistory } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserExtendedDataStorage {
  private readonly userExtendedData: WritableSignal<RefinedExtendedStreamingHistory> = signal([]);

  // public readonly deletingUserExtendedDataLoadingState: WritableSignal<LoadingState> = signal('idle');

  public getUserExtendedData(): RefinedExtendedStreamingHistory {
    return this.userExtendedData();
  }
  public setUserExtendedData(data: RefinedExtendedStreamingHistory): void {
    this.userExtendedData.set(data);
  }
}
