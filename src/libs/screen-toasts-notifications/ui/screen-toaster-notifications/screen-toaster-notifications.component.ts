import { Component, computed, inject } from '@angular/core';
import { ToastNotificationsService } from '../../services/toast-notifications.service';
import { TranslatePipe } from '@pipes';

@Component({
  selector: 'app-screen-toaster-notifications',
  imports: [TranslatePipe],
  templateUrl: './screen-toaster-notifications.component.html',
  styleUrl: './screen-toaster-notifications.component.scss',
})
export class ScreenToasterNotificationsComponent {
  private readonly screenToasterNotificationsService: ToastNotificationsService = inject(ToastNotificationsService);

  protected screenToasterNotifications = computed(() => {
    return this.screenToasterNotificationsService.getNotifications();
  });
}
