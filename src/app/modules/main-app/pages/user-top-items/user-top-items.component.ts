import { Component } from '@angular/core';
import {
  UserTopItemsSelectorComponent,
  UserTopItemsSimpleComponent,
} from '@widgets';

@Component({
  selector: 'app-user-top-items',
  imports: [UserTopItemsSimpleComponent, UserTopItemsSelectorComponent],
  templateUrl: './user-top-items.component.html',
  styleUrl: './user-top-items.component.scss',
})
export default class UserTopItemsComponent {}
