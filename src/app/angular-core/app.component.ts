import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScreenToasterNotificationsComponent, ScreenNotificationComponent } from "@libs";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScreenToasterNotificationsComponent, ScreenNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
