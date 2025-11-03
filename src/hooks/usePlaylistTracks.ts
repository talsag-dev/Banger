import { useQuery } from "@tanstack/react-query";
import type { PlaylistTracksResponse } from "@types";
import { http } from "@utils/http";

export const usePlaylistTracks = (
  userId: string | undefined,
  playlistId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["playlistTracks", userId, playlistId],
    queryFn: async (): Promise<PlaylistTracksResponse> => {
      if (!userId || !playlistId) {
        throw new Error("User ID and Playlist ID are required");
      }
      const data = await http<{
        playlist: PlaylistTracksResponse["playlist"];
        tracks: PlaylistTracksResponse["tracks"];
      }>(`/users/${userId}/playlists/${playlistId}/tracks`);
      return {
        playlist: data.playlist,
        tracks: data.tracks || [],
      };
    },
    enabled: enabled && !!userId && !!playlistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
