import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { PreloadService } from '@services';
import { AuthorizationInterceptor } from './interceptor';

export function appPreloadInitializer(preloadService: PreloadService) {
  return () => preloadService;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const interceptor = inject(AuthorizationInterceptor);
          return interceptor.intercept(req, {
            handle: (request) => next(request),
          });
        },
      ]),
    ),

    PreloadService,
    {
      provide: APP_INITIALIZER,
      useFactory: appPreloadInitializer,
      deps: [PreloadService],
      multi: true,
    },
  ],
};
