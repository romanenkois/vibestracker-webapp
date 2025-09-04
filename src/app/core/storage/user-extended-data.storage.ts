import { Injectable, signal } from '@angular/core';
import { ExtendedStreamingHistory } from '@types';

@Injectable({
  providedIn: 'root',
})
export class UserExtendedDataStorage {
  private readonly userExtendedData = signal<ExtendedStreamingHistory[]>([]);

  public getUserExtendedData(): ExtendedStreamingHistory[] {
    return this.userExtendedData();
  }
  public setUserExtendedData(data: ExtendedStreamingHistory[]): void {
    this.userExtendedData.set(data);
  }
}
