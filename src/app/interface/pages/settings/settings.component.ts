import { Component, inject } from '@angular/core';
import { AuthorizationCommand } from '@commands';
@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export default class SettingsComponent {
  private authorizationCommand: AuthorizationCommand = inject(AuthorizationCommand);

  logOut() {
    this.authorizationCommand.logOut();
  }
}
