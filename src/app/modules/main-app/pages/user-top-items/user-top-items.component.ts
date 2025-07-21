import { Component } from '@angular/core';
import { UserTopItemsSimpleComponent } from './user-top-items-simple/user-top-items-simple.component';
import { UserTopItemsSelectorComponent } from './user-top-items-selector/user-top-items-selector.component';

@Component({
  selector: 'app-user-top-items',
  imports: [UserTopItemsSimpleComponent, UserTopItemsSelectorComponent],
  templateUrl: './user-top-items.component.html',
  styleUrl: './user-top-items.component.scss',
})
export default class UserTopItemsComponent {}
