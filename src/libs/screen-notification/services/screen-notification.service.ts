import { Injectable, signal, WritableSignal } from '@angular/core';
import { ScreenMessage } from '/';

@Injectable({
  providedIn: 'root',
})
export class ScreenNotificationService {
  private messages: WritableSignal<ScreenMessage[]> = signal([]);

  public sendMessage(message: ScreenMessage) {
    this.messages.set([...this.messages(), message]);
  }
  public getMessage(): ScreenMessage | null {
    return this.messages()[0] || null;
  }
  public removeMessage() {
    this.messages.set(this.messages().slice(1));
  }
}
