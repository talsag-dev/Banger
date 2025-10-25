import type { SpotifyTrack } from "../services/spotifyApi";
import type { SearchResult } from "../components/SearchDialog/types";

export const convertSpotifyTrackToSearchResult = (
  track: SpotifyTrack
): SearchResult => {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return {
    id: track.id,
    type: "song",
    title: track.name,
    subtitle: `${artistNames} • ${track.album.name}`,
    emoji: "🎵", // You can customize this based on genre or use album art
  };
};

export const convertSpotifyTracksToSearchResults = (
  tracks: SpotifyTrack[]
): SearchResult[] => {
  return tracks.map(convertSpotifyTrackToSearchResult);
};

export const formatDuration = (durationMs: number): string => {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const getAlbumImage = (
  track: SpotifyTrack,
  size: "small" | "medium" | "large" = "medium"
): string | null => {
  const images = track.album.images;
  if (!images || images.length === 0) return null;

  // Sort by size (largest first)
  const sortedImages = [...images].sort(
    (a, b) => (b.width || 0) - (a.width || 0)
  );

  switch (size) {
    case "small":
      // Get smallest available
      return sortedImages[sortedImages.length - 1]?.url || null;
    case "large":
      // Get largest available
      return sortedImages[0]?.url || null;
    case "medium":
    default: {
      // Get medium-sized (typically 300x300 for Spotify)
      const mediumImage = sortedImages.find(
        (img) => (img.width || 0) >= 250 && (img.width || 0) <= 350
      );
      return (
        mediumImage?.url ||
        sortedImages[Math.floor(sortedImages.length / 2)]?.url ||
        null
      );
    }
  }
};
