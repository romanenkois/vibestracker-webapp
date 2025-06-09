export type ExtendedStreamingHistoryDTO = {
  ts: string;

  // is not actually present
  username?: string;

  platform: string;
  ms_played: number;
  conn_country: string;

  // it should be one of those
  ip_addr_decrypted?: string;
  ip_addr?: string;

  // should be present, but actually is not
  user_agent_decrypted?: string;

  master_metadata_track_name: string;
  master_metadata_album_artist_name: string;
  master_metadata_album_album_name: string;

  spotify_track_uri: string; // goes like "spotify:track:__string_id__"

  episode_name: string | null;
  episode_show_name: string | null;
  episode_show_uri: string | null;

  // those are not documented, but are present
  audiobook_title?: string | null;
  audiobook_uri?: string | null;
  audiobook_chapter_uri?: string | null;
  audiobook_chapter_title?: string | null;

  reason_start: string;
  reason_end: string;

  shuffle: null | true | false;
  skipped: null | true | false;
  offline: null | true | false;

  offline_timestamp: number | null;

  incognito_mode: null | true | false;
};

export type ExtendedStreamingHistory = {
  ts: string;
  platform: string;
  ms_played: number;
  conn_country: string;

  track_name: string;
  track_artist: string;
  track_album: string;

  uri: string;

  reason_start: string;
  reason_end: string;

  shuffle: null | true | false;
  skipped: null | true | false;
};

export type RefinedExtendedStreamingHistory = {
  ts: Date;
  ms_played: number;
  uri: string;
}
