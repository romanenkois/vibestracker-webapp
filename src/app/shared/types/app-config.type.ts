import { SupportedLocaleEnum } from './locale.type';
import { UserSettings } from './user-settings.type';

export type AppConfig = {
  api: {
    BASE_API_URL: string;
    BASE_CLIENT_URL: string;
  };
  spotify: {
    clientId: string;
    redirectUri: string;
    authorization: {
      scopes: string[];
      showDialog: 'true' | 'false';
    };
  };
  analyzer: {
    maxTopTracksAnalyze: number;
  };
  localization: {
    supportedLocales: SupportedLocaleEnum[];
  };
  defaultUserSettings: UserSettings;
  localeStorageKeys: {
    languageLocal: string;
    userToken: string;
  };
};
