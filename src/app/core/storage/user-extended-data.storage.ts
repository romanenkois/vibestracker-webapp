import { Injectable, signal, WritableSignal } from '@angular/core';
import { ExtendedStreamingHistory } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserExtandedDataStorage {
  private readonly userExtendedData: WritableSignal<ExtendedStreamingHistory> =
    signal([]);

  public getUserExtendedData(): ExtendedStreamingHistory {
    return this.userExtendedData();
  }
  public setUserExtendedData(data: ExtendedStreamingHistory): void {
    this.userExtendedData.set(data);
  }
}
