import { Component, inject } from '@angular/core';
import { AuthorizationCommand, ExtendedHistoryCommand, UserCommand } from '@commands';
@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export default class SettingsComponent {
  private authorizationCommand: AuthorizationCommand =
    inject(AuthorizationCommand);
  private extendedHistoryCommand: ExtendedHistoryCommand = inject(
    ExtendedHistoryCommand,
  );
  private userCommand: UserCommand = inject(
    UserCommand,
  );

  logOut() {
    this.authorizationCommand.logOut();
  }

  deleteExtendedHistory() {
    this.extendedHistoryCommand.deleteUserExtendedHistory();
  }

  clearIgnoredTracks() {
    this.userCommand.clearIgnoredTracks();
  }
}
