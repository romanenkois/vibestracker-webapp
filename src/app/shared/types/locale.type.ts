export enum SupportedLocaleEnum {
  EnglishUS = 'en-US',
  Ukrainian = 'uk',
  Japanese = 'ja',
}

export interface TranslationFile {
  locale: string;
  translations: Record<string, string>;
}
