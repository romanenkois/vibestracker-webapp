import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { $appConfig } from 'src/environments/environments.production';

import { PreloadService, TranslationService } from '@services';
import { SupportedLocaleEnum } from '@types';

import { routes } from './app.routes';
import { AuthorizationInterceptor } from './interceptor';

export function appPreloadInitializer(preloadService: PreloadService) {
  return () => preloadService;
}

export function translationInitializer(translationService: TranslationService) {
  return () => {
    // Determine initial locale from localStorage or browser preference
    const savedLocale = localStorage.getItem($appConfig.localeStorageKeys.languageLocal) as SupportedLocaleEnum;

    let initialLocale: SupportedLocaleEnum;

    if (savedLocale && ['en-US', 'uk', 'ja'].includes(savedLocale)) {
      initialLocale = savedLocale;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language || 'en-US';
      if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) {
        initialLocale = SupportedLocaleEnum.Ukrainian;
      } else if (browserLang.startsWith('ja')) {
        initialLocale = SupportedLocaleEnum.Japanese;
      } else {
        initialLocale = SupportedLocaleEnum.EnglishUS;
      }
    }

    return translationService.setLocale(initialLocale).catch((error) => {
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
      ])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),

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
