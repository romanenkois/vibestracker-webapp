import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStorage } from '@storage';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationInterceptor implements HttpInterceptor {
  private readonly userStorage: UserStorage = inject(UserStorage);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
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
          window.alert('Час сесії закінчився, будь ласка увійдіть знову');
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
