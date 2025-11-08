export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
    release_date: string;
  };
  duration_ms: number;
  external_urls: { spotify: string; soundcloud?: string };
  preview_url: string | null;
  popularity?: number;
  explicit?: boolean;
  provider?: 'spotify' | 'soundcloud'; // Indicates which provider the track comes from
}

export interface SpotifySearchResponse {
  results: {
    tracks?: {
      items: SpotifyTrack[];
      total: number;
      limit: number;
      offset: number;
    };
    artists?: {
      items: Array<{
        id: string;
        name: string;
        images: Array<{ url: string; height: number; width: number }>;
        followers: { total: number };
        genres: string[];
      }>;
    };
    albums?: {
      items: Array<{
        id: string;
        name: string;
        artists: Array<{ id: string; name: string }>;
        images: Array<{ url: string; height: number; width: number }>;
        release_date: string;
      }>;
    };
  };
  query: string;
  type: string;
  success: boolean;
}

export interface SpotifyAuthResponse {
  authUrl: string;
  state: string;
  message: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  country: string;
  product: string;
}

export interface SpotifyCurrentlyPlaying {
  track: SpotifyTrack | null;
  isPlaying: boolean;
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
}
