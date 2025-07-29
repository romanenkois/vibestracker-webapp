import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, signal, effect, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translate',
  pure: false, // Make it impure so it updates when language changes
  standalone: true,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _translationService: TranslationService = inject(TranslationService);
  private _translationUpdateEffect: any;

  constructor() {
    // Create an effect that triggers change detection when translations change
    this._translationUpdateEffect = effect(() => {
      // Access the translations signal to make this effect reactive
      this._translationService.getTranslations();
      // Trigger change detection when translations change
      this._cdr.markForCheck();
    });
  }

  transform(key: string, fallback?: string): string {
    const translation = this._translationService.translate(key, fallback);

    // If translation service isn't initialized yet and we're showing a key,
    // show a formatted version instead of the raw key
    if (!this._translationService.isInitialized() && translation === key && !fallback) {
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
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  }

  ngOnDestroy() {
    if (this._translationUpdateEffect) {
      this._translationUpdateEffect.destroy();
    }
  }
}
