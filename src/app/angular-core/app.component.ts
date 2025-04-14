import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  router: Router = inject(Router);

  showHeader: boolean = true;

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showHeader = this.router.url !== '/login';
    });
  }
}
