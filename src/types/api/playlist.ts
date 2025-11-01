import type { MusicProvider } from "../index";

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

