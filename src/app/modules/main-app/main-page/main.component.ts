import { Component, effect, inject, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PreloadService } from '@services';
import { PreloadUserLoginStatusEnum } from '@types';
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
  private readonly _router: Router = inject(Router);
  private readonly _preloadService: PreloadService = inject(PreloadService);

  protected showHeader: boolean = true;
  protected userIsLoggedIn = this._preloadService.preloadUserLoginStatus;

  constructor() {
    this._preloadService.verifyUserByToken();

    effect(() => {
      if (this.userIsLoggedIn() === PreloadUserLoginStatusEnum.Rejected) {
        this._router.navigate(['/login']);
      }
    });
  }
}
