import { AppConfig } from '@types';

export const $appConfig: AppConfig = {
  api: {
    BASE_API_URL: 'http://localhost:3000',
    BASE_CLIENT_URL: 'http://localhost:4200',
  },
  spotify: {
    clientId: 'a31fa8a78acd482692cdac91675babff',
    redirectUri: 'http://localhost:4200/login',
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
    }
  },
};
