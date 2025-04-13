import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { PreloadService } from '@services';
import { provideHttpClient } from '@angular/common/http';

export function appPreloadInitializer(preloadService: PreloadService) {
  return () => preloadService;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    PreloadService,
    {
      provide: APP_INITIALIZER,
      useFactory: appPreloadInitializer,
      deps: [PreloadService],
      multi: true,
    },
  ],
};
