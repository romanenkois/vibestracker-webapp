import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthorizationCommand, ExtendedHistoryCommand, UserCommand } from '@commands';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { LanguageSelectorComponent, LoadingSpinner } from '@features';
import { DeletingStatusEnum } from '@types';

@Component({
  selector: 'app-settings',
  imports: [TranslatePipe, LanguageSelectorComponent, LoadingSpinner],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export default class SettingsComponent {
  private readonly _authorizationCommand = inject(AuthorizationCommand);
  private readonly _extendedHistoryCommand = inject(ExtendedHistoryCommand);
  private readonly _userCommand = inject(UserCommand);

  protected DeletingStatusEnum = DeletingStatusEnum;

  protected deleteExtendedHistoryStatus = signal(DeletingStatusEnum.Idle);

  protected deleteExtendedHistory() {
    this._extendedHistoryCommand.deleteUserExtendedHistory().subscribe((status) => {
      this.deleteExtendedHistoryStatus.set(status);
    });
  }
  protected clearIgnoredTracks() {
    this._userCommand.clearIgnoredTracks();
  }
  protected logOut() {
    this._authorizationCommand.logOut();
  }
}
