import { Injectable, signal, WritableSignal } from "@angular/core";
import { ToastNotification } from "@types";


@Injectable({
  providedIn: 'root',
})
export class ToastNotificationsService {
  private toastNotifications: WritableSignal<ToastNotification[]> = signal([]);

  public getNotifications(): ToastNotification[] {
    return this.toastNotifications();
  }

  public addNotification(notification: ToastNotification): void {
    this.toastNotifications.set([...this.toastNotifications(), notification]);
  }
}
