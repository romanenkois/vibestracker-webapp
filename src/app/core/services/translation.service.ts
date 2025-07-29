import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SupportedLocale, TranslationFile } from '@types';
import { $appConfig } from '@environments';

// This service was entirely vibecoded ^^
// fuck you illya in future

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly currentLocale: WritableSignal<SupportedLocale> = signal($appConfig.localization.defaultLocale);
  private readonly translations: WritableSignal<Record<string, string>> = signal({});
  private readonly isLoading: WritableSignal<boolean> = signal(false);
  private initialized = false;

  // Observable for components that need to react to language changes
  private localeChange$ = new BehaviorSubject<SupportedLocale>(this.currentLocale());

  public readonly supportedLocales: SupportedLocale[] = $appConfig.localization.supportedLocales;

  constructor(private http: HttpClient) {
    // Don't auto-initialize here - let APP_INITIALIZER handle it
  }

  /**
   * Get current locale as signal
   */
  getCurrentLocale(): Signal<SupportedLocale> {
    return this.currentLocale;
  }

  /**
   * Get current locale as observable for reactive components
   */
  // getCurrentLocale$(): Observable<SupportedLocale> {
  //   return this.localeChange$.asObservable();
  // }

  // getCurrentLocale(): SupportedLocale {
  //   return this.currentLocale();
  // }

  /**
   * Get current translations as signal
   */
  getTranslations(): Record<string, string> {
    return this.translations();
  }

  /**
   * Get loading state
   */
  getIsLoading(): boolean {
    return this.isLoading();
  }

  /**
   * Check if the translation service has been initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Translate a key to current language
   */
  translate(key: string, fallback?: string): string {
    const translation = this.translations()[key];
    if (translation) {
      return translation;
    }

    // If no translation is found and we have a fallback, use it
    if (fallback) {
      return fallback;
    }

    // If no translations are loaded yet, return a more user-friendly fallback
    const translations = this.translations();
    if (Object.keys(translations).length === 0 && !this.isLoading()) {
      // Return key without prefix for better UX during initialization
      return this.formatKeyAsFallback(key);
    }

    return key;
  }

  /**
   * Format a translation key as a user-friendly fallback
   */
  private formatKeyAsFallback(key: string): string {
    // Convert camelCase or snake_case to readable text
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .toLowerCase()
      .trim()
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  }

  /**
   * Set the current locale and load its translations
   */
  async setLocale(locale: SupportedLocale): Promise<void> {
    if (locale === this.currentLocale() && this.initialized) {
      return;
    }

    this.isLoading.set(true);

    try {
      await this.loadTranslations(locale);
      this.currentLocale.set(locale);
      this.localeChange$.next(locale);
      this.saveToStorage(locale);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to load translations for locale:', locale, error);

      // If this is not the first initialization attempt and we're not trying English, fallback to English
      if (this.initialized || locale === 'en-US') {
        throw error;
      }

      console.warn('Falling back to English translations');
      try {
        await this.loadTranslations('en-US');
        this.currentLocale.set('en-US');
        this.localeChange$.next('en-US');
        this.saveToStorage('en-US');
        this.initialized = true;
      } catch (fallbackError) {
        console.error('Failed to load English fallback translations:', fallbackError);
        this.initialized = true; // Mark as initialized even if failed to prevent infinite loops
        throw fallbackError;
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Load translations for a specific locale
   */
  private async loadTranslations(locale: SupportedLocale): Promise<void> {
    const translationFile = await this.getTranslationFile(locale);
    this.translations.set(translationFile.translations);
  }

  /**
   * Get translation file for a locale
   */
  private getTranslationFile(locale: SupportedLocale): Promise<TranslationFile> {
    const filePath = this.getTranslationFilePath(locale);

    return this.http
      .get<TranslationFile>(filePath)
      .pipe(
        catchError((error) => {
          console.error(`Failed to load translation file for ${locale}:`, error);
          // Fallback to English if the translation file fails to load
          if (locale !== 'en-US') {
            return this.http.get<TranslationFile>(this.getTranslationFilePath('en-US'));
          }
          throw error;
        }),
      )
      .toPromise() as Promise<TranslationFile>;
  }

  /**
   * Get the file path for a locale's translations
   */
  private getTranslationFilePath(locale: SupportedLocale): string {
    switch (locale) {
      case 'en-US':
        return 'translations/source.json';
      case 'uk':
        return 'translations/locale.uk.json';
      case 'ja':
        return 'translations/locale.ja.json';
      default:
        return 'translations/source.json';
    }
  }

  /**
   * Save current locale to localStorage
   */
  private saveToStorage(locale: SupportedLocale): void {
    localStorage.setItem('vibes-tracker-locale', locale);
  }

  /**
   * Get display name for a locale (for UI purposes)
   */
  getLocaleDisplayName(locale: SupportedLocale): string {
    switch (locale) {
      case 'en-US':
        return 'English';
      case 'uk':
        return 'Українська';
      case 'ja':
        return '日本語';
      default:
        return locale;
    }
  }
}
