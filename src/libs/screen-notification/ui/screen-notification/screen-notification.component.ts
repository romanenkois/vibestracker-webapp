import { Component, computed, inject, Signal } from '@angular/core';
import { ScreenNotificationService } from '../../services/screen-notification.service';
import { ScreenMessage } from '../../types/shared';
import { TranslatePipe } from '@pipes';

@Component({
  selector: 'app-screen-notification',
  imports: [TranslatePipe],
  templateUrl: './screen-notification.component.html',
  styleUrl: './screen-notification.component.scss',
})
export class ScreenNotificationComponent {
  screenNotificationService: ScreenNotificationService = inject(
    ScreenNotificationService,
  );

  message: Signal<ScreenMessage | null> = computed(() => {
    return this.screenNotificationService.getMessage();
  });

  close() {
    this.screenNotificationService.removeMessage();
  }
}
