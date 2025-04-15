export type Album = {
  album_type: 'album' | 'single' | 'compilation';
  total_tracks: number;
  href: string;
  id: string;
  images: {
    url: string;
    height: number | null;
    width: number| null;
  }[];
  name: string;
  release_date: string;
  type: 'album';
  uri: string;
  artists: ArtistSimplified[];
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: {
      artists: ArtistSimplified[];
      duration_ms: number;
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
      is_local: boolean;
    }[];
  }[];
  label: string;
  popularity: number;
};

type ArtistSimplified = {
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};
