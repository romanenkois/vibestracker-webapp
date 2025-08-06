import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthorizationCommand, ExtendedHistoryCommand, UserCommand } from '@commands';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { LanguageSelectorComponent, LoadingSpinner } from '@features';
import { UploadingStatus } from '@types';

@Component({
  selector: 'app-settings',
  imports: [TranslatePipe, LanguageSelectorComponent, LoadingSpinner],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export default class SettingsComponent {
  private authorizationCommand: AuthorizationCommand = inject(AuthorizationCommand);
  private extendedHistoryCommand: ExtendedHistoryCommand = inject(ExtendedHistoryCommand);
  private userCommand: UserCommand = inject(UserCommand);

  logOut() {
    this.authorizationCommand.logOut();
  }

  protected deleteExtendedHistoryStatus: WritableSignal<UploadingStatus> = signal('idle');
  deleteExtendedHistory() {
    this.extendedHistoryCommand.deleteUserExtendedHistory().subscribe((status: UploadingStatus) => {
      this.deleteExtendedHistoryStatus.set(status);
    });
  }

  clearIgnoredTracks() {
    this.userCommand.clearIgnoredTracks();
  }
}
