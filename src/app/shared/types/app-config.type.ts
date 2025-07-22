import { UserSettings } from "./user-settings.type";

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
  },
  analyzer: {
    maxTopTracksAnalyze: number;
  },
  defaultUserSettings: UserSettings;
};
