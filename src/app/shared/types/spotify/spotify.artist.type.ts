export type Artist = {
  followers: {
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
};
