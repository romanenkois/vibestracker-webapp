import { Component, computed, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PreloadService } from '@services';
import { PreloadUserLoginState } from '@types';
import { NavBarComponent } from '@widgets';
import { LoadingSpinner } from "../../../interface/features/loading-spinner/loading-spinner";

@Component({
  selector: 'app-main',
  imports: [RouterModule, NavBarComponent, LoadingSpinner],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent implements OnInit {
  private _router: Router = inject(Router);
  private _preloadService: PreloadService = inject(PreloadService);

  protected showHeader: boolean = true;
  protected userIsLogedIn: WritableSignal<PreloadUserLoginState> = this._preloadService.preloadUserLoginStatus;

  constructor() {
    effect(() => {
      if (this.userIsLogedIn() === 'rejected') {
        this._router.navigate(['/login']);
      }
    })
  }

  ngOnInit() {
    // this._router.events.subscribe(() => {
    //   this.showHeader = this._router.url !== '/login';
    // });

  }
}
