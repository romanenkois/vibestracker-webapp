import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, signal, effect, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translate',
  pure: false, // Make it impure so it updates when language changes
  standalone: true
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private translationUpdateEffect: any;

  constructor() {
    // Create an effect that triggers change detection when translations change
    this.translationUpdateEffect = effect(() => {
      // Access the translations signal to make this effect reactive
      this.translationService.getTranslations();
      // Trigger change detection when translations change
      this.cdr.markForCheck();
    });
  }

  transform(key: string, fallback?: string): string {
    const translation = this.translationService.translate(key, fallback);

    // If translation service isn't initialized yet and we're showing a key,
    // show a formatted version instead of the raw key
    if (!this.translationService.isInitialized() && translation === key && !fallback) {
      return this.formatKeyAsFallback(key);
    }

    return translation;
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
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }

  ngOnDestroy(): void {
    // Clean up the effect
    if (this.translationUpdateEffect) {
      this.translationUpdateEffect.destroy();
    }
  }
}
