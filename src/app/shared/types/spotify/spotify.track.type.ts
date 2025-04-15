export type Track = {
  album: AlbumSimplified;
  artists: ArtistSimplified[];
  duration_ms: number;
  href: string;
  id: string;
  linked_from?: {};
  restrictions?: {
    reason: 'market' | 'product' | 'explicit';
  };
  name: string;
  popularity: number;
  type: 'track';
  uri: string;
};

type AlbumSimplified = {
  album_type: 'album' | 'single' | 'compilation';
  total_tracks: number;
  href: string;
  id: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  name: string;
  release_date: string;
  type: 'album';
  uri: string;
  artists: ArtistSimplified[];
};

type ArtistSimplified = {
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};
