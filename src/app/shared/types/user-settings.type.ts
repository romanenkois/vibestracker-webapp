export type UserSettings = {
  theme: string;
  locale: string;
  saveToken: boolean;
  extendedHistory: {
    ignoredTracks: string[];
  }
}
