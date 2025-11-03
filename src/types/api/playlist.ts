import type { MusicProvider } from "../index";
import type { Track } from "../music";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  image?: string;
  owner: string;
  provider: MusicProvider;
  trackCount: number;
  externalUrl?: string;
}

export interface PlaylistTracksResponse {
  playlist: Playlist;
  tracks: Track[];
}
