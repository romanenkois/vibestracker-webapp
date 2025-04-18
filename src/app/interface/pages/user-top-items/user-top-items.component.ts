import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTopItemsSimpleComponent } from '../../widgets/user-top-items-simple/user-top-items-simple.component';
import { SimpleItemsSelection, SimpleTimeFrame } from '@types';
import { UserTopItemsSelectorComponent } from "../../widgets/user-top-items-selector/user-top-items-selector.component";

@Component({
  selector: 'app-user-top-items',
  imports: [UserTopItemsSimpleComponent, UserTopItemsSelectorComponent],
  templateUrl: './user-top-items.component.html',
  styleUrl: './user-top-items.component.scss',
})
export default class UserTopItemsComponent {

}
