import { Component, HostListener, inject, signal } from '@angular/core';
import { ToastNotificationsService, TranslationService } from '@services';
import { SupportedLocaleEnum } from '@types';

@Component({
  selector: 'app-language-selector',
  imports: [],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelectorComponent {
  private readonly _translationService = inject(TranslationService);
  private readonly _toastNotificationsService = inject(ToastNotificationsService);

  protected currentLocale = this._translationService.getCurrentLocale();
  protected supportedLocales = this._translationService.supportedLocales;
  protected isOpen = signal<boolean>(false);
  protected isLoading = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  listenToClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector') && this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  async selectLanguage(locale: SupportedLocaleEnum): Promise<void> {
    try {
      await this._translationService.setLocale(locale);

      this.isOpen.set(false);
      this._toastNotificationsService.sendNotification({
        type: 'success',
        message: `Language changed to ${this.getLocaleDisplayName(locale)}`,
      });
    } catch (error) {
      this._toastNotificationsService.sendNotification({
        type: 'error',
        message: `Failed to change language to ${this.getLocaleDisplayName(locale)}${error ? `,\n${error}` : ''}`,
      });
      console.error('Failed to change language:', error);
    }
  }

  protected getCurrentLanguageDisplay(): string {
    return this.getLocaleDisplayName(this.currentLocale());
  }

  protected getLocaleDisplayName(locale: SupportedLocaleEnum): string {
    return this._translationService.getLocaleDisplayName(locale);
  }
}
