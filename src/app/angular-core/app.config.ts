import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { PreloadService, TranslationService } from '@services';
import { AuthorizationInterceptor } from './interceptor';

export function appPreloadInitializer(preloadService: PreloadService) {
  return () => preloadService;
}

export function translationInitializer(translationService: TranslationService) {
  return () => {
    // Determine initial locale from localStorage or browser preference
    const savedLocale = localStorage.getItem('vibes-tracker-locale') as 'en-US' | 'uk' | 'ja';

    let initialLocale: 'en-US' | 'uk' | 'ja';

    if (savedLocale && ['en-US', 'uk', 'ja'].includes(savedLocale)) {
      initialLocale = savedLocale;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language || 'en-US';
      if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) {
        initialLocale = 'uk';
      } else if (browserLang.startsWith('ja')) {
        initialLocale = 'ja';
      } else {
        initialLocale = 'en-US';
      }
    }

    return translationService.setLocale(initialLocale).catch(error => {
      console.warn('Failed to initialize translations, using fallback', error);
      // Return resolved promise even if translation loading fails
      return Promise.resolve();
    });
  };
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
    TranslationService,
    {
      provide: APP_INITIALIZER,
      useFactory: appPreloadInitializer,
      deps: [PreloadService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translationInitializer,
      deps: [TranslationService],
      multi: true,
    },
  ],
};
