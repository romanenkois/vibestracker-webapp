import { AppConfig } from '@types';

export const $appConfig: AppConfig = {
  api: {
    BASE_API_URL: 'https://vibestracker-server.vercel.app',
    BASE_CLIENT_URL: 'https://vibestracker-webapp.vercel.app',
  },
  spotify: {
    clientId: 'a31fa8a78acd482692cdac91675babff',
    redirectUri: 'https://vibestracker-webapp.vercel.app/login',
    authorization: {
      scopes: [
        'user-read-email',
        'user-read-private',

        'user-read-recently-played',
        'user-read-currently-playing',
        'user-top-read',
        'user-read-playback-position',
      ],
      showDialog: 'true',
    },
  },
  defaultUserSettings: {
    theme: 'dark',
    saveToken: true,
    extendedHistrory: {
      ignoredTracks: [],
    },
  },
};
