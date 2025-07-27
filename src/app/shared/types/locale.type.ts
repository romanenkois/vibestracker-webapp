export type SupportedLocale = 'en-US' | 'uk' | 'ja';

export interface TranslationFile {
  locale: string;
  translations: Record<string, string>;
}
