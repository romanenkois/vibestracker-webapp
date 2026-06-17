import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@pipes';
import { SimpleItemsSelection, SimpleTimeFrame } from '@types';

@Component({
  selector: 'app-user-top-items-selector',
  imports: [TranslatePipe],
  templateUrl: './user-top-items-selector.component.html',
  styleUrl: './user-top-items-selector.component.scss',
})
export class UserTopItemsSelectorComponent implements OnInit {
  private router: Router = inject(Router);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);

  itemsType: SimpleItemsSelection = 'tracks';
  periodOfTime: SimpleTimeFrame = 'short_term';

  changeItemsType(itemsType: SimpleItemsSelection) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        'items-type': itemsType,
      },
      queryParamsHandling: 'merge',
    });
    this.itemsType = itemsType;
  }

  changePeriodOfTime(periodOfTime: SimpleTimeFrame) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        'period-of-time': periodOfTime,
      },
      queryParamsHandling: 'merge',
    });
    this.periodOfTime = periodOfTime;
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      const itemsType = params['items-type'];
      const periodOfTime = params['period-of-time'];

      if (itemsType) {
        this.itemsType = itemsType;
      }
      if (periodOfTime) {
        this.periodOfTime = periodOfTime;
      }
    });
  }
}
