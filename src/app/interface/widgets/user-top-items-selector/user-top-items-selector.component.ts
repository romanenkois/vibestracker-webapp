import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleItemsSelection, SimpleTimeFrame } from '@types';

@Component({
  selector: 'app-user-top-items-selector',
  imports: [],
  templateUrl: './user-top-items-selector.component.html',
  styleUrl: './user-top-items-selector.component.scss'
})
export class UserTopItemsSelectorComponent {
  private router: Router = inject(Router);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);

  changeItemsType(itemsType: SimpleItemsSelection) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        'items-type': itemsType
      },
      queryParamsHandling: 'merge'
    });
  }

  changePeriodOfTime(periodOfTime: SimpleTimeFrame) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        'period-of-time': periodOfTime
      },
      queryParamsHandling: 'merge'
    });
  }
}
