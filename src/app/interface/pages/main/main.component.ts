import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavBarComponent } from '@widgets';

@Component({
  selector: 'app-main',
  imports: [RouterModule, NavBarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent implements OnInit {
  router: Router = inject(Router);

  showHeader: boolean = true;

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showHeader = this.router.url !== '/login';
    });
  }
}
