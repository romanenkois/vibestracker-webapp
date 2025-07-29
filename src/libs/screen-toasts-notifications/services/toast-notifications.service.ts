import { Injectable, signal, WritableSignal, DestroyRef, inject, OnDestroy } from '@angular/core';
import { ToastNotification } from '../types/shared';

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationsService implements OnDestroy {
  private destroyRef = inject(DestroyRef);
  private toastNotifications: WritableSignal<ToastNotification[]> = signal([]);
  private timeouts = new Map<string, number>();

  ngOnDestroy(): void {
    this.destroyRef.onDestroy(() => {
      this.clearAllTimeouts();
    });
  }

  public getNotifications(): ToastNotification[] {
    return this.toastNotifications();
  }

  public sendNotification(notification: Omit<ToastNotification, 'id' | 'duration'> & { duration?: number }): void {
    const newNotification: ToastNotification = {
      ...notification,
      id: this.generateId(),
      duration: notification.duration || 5000,
    };

    this.toastNotifications.set([...this.toastNotifications(), newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      this.scheduleRemoval(newNotification.id, newNotification.duration);
    }
  }

  public removeNotification(id: string): void {
    this.clearTimeout(id);
    this.toastNotifications.set(this.toastNotifications().filter((notification) => notification.id !== id));
  }

  public removeAllNotifications(): void {
    this.clearAllTimeouts();
    this.toastNotifications.set([]);
  }

  private scheduleRemoval(id: string, duration: number): void {
    const timeoutId = window.setTimeout(() => {
      this.removeNotification(id);
    }, duration);

    this.timeouts.set(id, timeoutId);
  }

  private clearTimeout(id: string): void {
    const timeoutId = this.timeouts.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }
  }

  private clearAllTimeouts(): void {
    this.timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    this.timeouts.clear();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
