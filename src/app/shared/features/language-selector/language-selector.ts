import { Component, HostListener, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ToastNotificationsService, TranslationService } from '@services';
import { SupportedLocale } from '@types';

@Component({
  selector: 'app-language-selector',
  imports: [],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelectorComponent {
  private _translationService: TranslationService = inject(TranslationService);
  private _toastNotificationsService: ToastNotificationsService = inject(ToastNotificationsService);

  protected isOpen: WritableSignal<boolean> = signal(false);
  protected currentLocale: Signal<SupportedLocale> = this._translationService.getCurrentLocale();
  protected supportedLocales: SupportedLocale[] = this._translationService.supportedLocales;
  protected isLoading: WritableSignal<boolean> = signal(false);

  @HostListener('document:click', ['$event'])
  listenToClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector') && this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  async selectLanguage(locale: SupportedLocale): Promise<void> {
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
        message: `Failed to change language to ${this.getLocaleDisplayName(locale)}`,
      });
      console.error('Failed to change language:', error);
    }
  }

  protected getCurrentLanguageDisplay(): string {
    return this.getLocaleDisplayName(this.currentLocale());
  }

  protected getLocaleDisplayName(locale: SupportedLocale): string {
    return this._translationService.getLocaleDisplayName(locale);
  }
}
