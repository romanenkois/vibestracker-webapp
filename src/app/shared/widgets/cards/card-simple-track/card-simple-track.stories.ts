import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { CardSimpleTrackComponent } from './card-simple-track.component';
import { Track } from '@types';

const mockTrack: Track = {
  id: 'track-123',
  name: 'Shape of You',
  artists: [
    { id: 'artist-1', name: 'Ed Sheeran', href: 'https://api.spotify.com/v1/artists/artist-1', type: 'artist', uri: 'spotify:artist:artist-1' },
  ],
  album: {
    id: 'album-1',
    name: '÷ (Deluxe)',
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', width: 640, height: 640 },
    ],
    album_type: 'album',
    total_tracks: 16,
    href: 'https://api.spotify.com/v1/albums/album-1',
    release_date: '2017-03-03',
    type: 'album',
    uri: 'spotify:album:album-1',
    artists: [
      { id: 'artist-1', name: 'Ed Sheeran', href: 'https://api.spotify.com/v1/artists/artist-1', type: 'artist', uri: 'spotify:artist:artist-1' },
    ],
  },
  duration_ms: 233713,
  href: 'https://api.spotify.com/v1/tracks/track-123',
  popularity: 95,
  type: 'track',
  uri: 'spotify:track:7qiZfU4dY1lWllzX7mPBI',
};


const meta = {
  title: 'Widgets/CardSimpleTrack',
  component: CardSimpleTrackComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([]), provideHttpClient()],
    }),
  ],
  tags: ['autodocs'],
  render: (args) => ({ props: args }),
} satisfies Meta<typeof CardSimpleTrackComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    track: mockTrack,
  },
};
