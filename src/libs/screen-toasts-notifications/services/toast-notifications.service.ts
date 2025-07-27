import { Injectable, signal, WritableSignal } from "@angular/core";
import { ToastNotification } from "../types/shared";


@Injectable({
  providedIn: 'root',
})
export class ToastNotificationsService {
  private toastNotifications: WritableSignal<ToastNotification[]> = signal([]);

  public getNotifications(): ToastNotification[] {
    return this.toastNotifications();
  }

  public sendNotification(notification: Omit<ToastNotification, 'id'>): void {
    this.toastNotifications.set([...this.toastNotifications(), { ...notification, id: this.generateId() }]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
