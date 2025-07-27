import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStorage } from '@storage';
import { catchError, Observable, throwError } from 'rxjs';
import { ScreenNotificationService } from '../core/services/screen-notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationInterceptor implements HttpInterceptor {
  private userStorage: UserStorage = inject(UserStorage);
  private screenNotificationService: ScreenNotificationService = inject(ScreenNotificationService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.userStorage.getToken();

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.screenNotificationService.sendMessage({
            title: '@@alert_sessionExpired-title',
            message: '@@alert_sessionExpired-message',
            buttonMessage: '@@alert_sessionExpired-buttonMessage',
          });
          this.userStorage.setToken(null);
          window.location.reload();
        }
        return throwError(() => {
          console.log(error);
        });
      }),
    );
  }
}
