import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-top-items',
  imports: [],
  templateUrl: './user-top-items.component.html',
  styleUrl: './user-top-items.component.scss',
})
export default class UserTopItemsComponent implements OnInit {
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      const itemsType = params['itemsType'];
      const periodOfTime = params['periodOfTime'];

      if (itemsType && periodOfTime) {
        console.log('Items Type:', itemsType);
        console.log('Period of Time:', periodOfTime);
      }
    });
  }
}
