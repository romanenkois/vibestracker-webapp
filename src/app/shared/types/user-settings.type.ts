import { SupportedLocaleEnum } from "./locale.type";

export type UserSettings = {
  theme: string;
  locale: SupportedLocaleEnum;
  saveToken: boolean;
  extendedHistory: {
    ignoredTracks: string[];
  }
}
