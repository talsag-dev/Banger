import type { MusicProvider } from "@types";

export const getPlatformName = (provider: MusicProvider): string => {
  switch (provider) {
    case "spotify":
      return "Spotify";
    case "apple-music":
      return "Apple Music";
    case "youtube-music":
      return "YouTube Music";
    case "soundcloud":
      return "SoundCloud";
    default:
      return provider;
  }
};
