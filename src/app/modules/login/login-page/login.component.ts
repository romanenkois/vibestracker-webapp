import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { $appConfig } from '@environments';
import { AuthorizationCommand } from '@commands';
import { LoadingState } from '@types';
import { TranslatePipe } from '@pipes';
import { LoadingSpinner } from '@features';

@Component({
  selector: 'app-login',
  imports: [TranslatePipe, LoadingSpinner],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  authorizationCommand: AuthorizationCommand = inject(AuthorizationCommand);

  loadingState: LoadingState = 'idle';

  getAuthorizationUrl(): string {
    const state = '37';
    const scopes = $appConfig.spotify.authorization.scopes.join('%20');
    return `https://accounts.spotify.com/authorize?client_id=${$appConfig.spotify.clientId}&redirect_uri=${$appConfig.spotify.redirectUri}&response_type=code&state=${state}&scope=${scopes}&show_dialog=${$appConfig.spotify.authorization.showDialog}`;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const code = params['code'];
      const state = params['state'];
      const error = params['error'];

      if (code && state) {
        this.authorizationCommand.codeLogIn(code).subscribe((loadingState: LoadingState) => {
          this.loadingState = loadingState;
          if (loadingState === 'resolved') {
            this.router.navigate(['/']);
          } else if (loadingState === 'error') {
            this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: {},
              replaceUrl: true,
            });
          }
        });
      } else if (error) {
        window.alert(`error: \n${error}`);
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {},
          replaceUrl: true,
        });
        console.error('Error during authorization:', error);
      }
    });
  }
}
