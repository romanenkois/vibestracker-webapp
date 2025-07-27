import { Component, HostListener, inject, signal } from '@angular/core';
import { TranslationService, SupportedLocale } from '@services';

@Component({
  selector: 'app-language-selector',
  imports: [],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelectorComponent {
  translationService = inject(TranslationService);

  isOpen = signal(false);
  currentLocale = signal<SupportedLocale>('en-US');
  supportedLocales: SupportedLocale[] = ['en-US', 'uk', 'ja'];
  isLoading = signal(false);

  constructor() {
    // Initialize with current locale from service
    this.currentLocale.set(this.translationService.getCurrentLocale());
    this.isLoading.set(this.translationService.getIsLoading());

    // Subscribe to locale changes
    this.translationService.getCurrentLocale$().subscribe((locale) => {
      this.currentLocale.set(locale);
    });

    // Monitor loading state changes
    // Note: In a real app, you might want to use computed() or effect() for this
    setInterval(() => {
      this.isLoading.set(this.translationService.getIsLoading());
    }, 100);
  }
  toggleDropdown(): void {
    this.isOpen.update((open) => !open);
  }

  @HostListener('document:click', ['$event'])
  listenToClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector') && this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  async selectLanguage(locale: SupportedLocale): Promise<void> {
    try {
      await this.translationService.setLocale(locale);
      this.isOpen.set(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }

  getCurrentLanguageDisplay(): string {
    return this.getLocaleDisplayName(this.currentLocale());
  }

  getLocaleDisplayName(locale: SupportedLocale): string {
    return this.translationService.getLocaleDisplayName(locale);
  }
}
