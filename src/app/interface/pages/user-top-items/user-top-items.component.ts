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

@Component({
  selector: 'app-user-top-items',
  imports: [UserTopItemsSimpleComponent],
  templateUrl: './user-top-items.component.html',
  styleUrl: './user-top-items.component.scss',
})
export default class UserTopItemsComponent implements OnInit {
  private router: Router = inject(Router);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);

  itemsType: WritableSignal<SimpleItemsSelection> =
    signal<SimpleItemsSelection>('tracks');
  periodOfTime: WritableSignal<SimpleTimeFrame> =
    signal<SimpleTimeFrame>('short_term');

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      const itemsType = params['items-type'];
      const periodOfTime = params['period-of-time'];

      if (itemsType && periodOfTime) {
        this.itemsType.set(itemsType as SimpleItemsSelection);
        this.periodOfTime.set(periodOfTime as SimpleTimeFrame);
      } else {
        this.router.navigate([], {
          relativeTo: this.activeRoute,
          queryParams: { 'items-type': 'tracks', 'period-of-time': 'short_term' },
        });

        this.itemsType.set(itemsType as SimpleItemsSelection);
        this.periodOfTime.set(periodOfTime as SimpleTimeFrame);
      }
    });
  }
}
