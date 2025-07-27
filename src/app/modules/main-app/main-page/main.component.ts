import { Component, effect, inject, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PreloadService } from '@services';
import { PreloadUserLoginState } from '@types';
import { NavBarComponent } from '@widgets';
import { LoadingSpinner } from '@features';
import { TranslatePipe } from '@pipes';

@Component({
  selector: 'app-main',
  imports: [RouterModule, NavBarComponent, LoadingSpinner, TranslatePipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent {
  private _router: Router = inject(Router);
  private _preloadService: PreloadService = inject(PreloadService);

  protected showHeader: boolean = true;
  protected userIsLoggedIn: WritableSignal<PreloadUserLoginState> = this._preloadService.preloadUserLoginStatus;

  constructor() {
    this._preloadService.verifyUserByToken();

    effect(() => {
      if (this.userIsLoggedIn() === 'rejected') {
        this._router.navigate(['/login']);
      }
    });
  }
}
