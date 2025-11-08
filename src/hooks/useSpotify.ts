import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@utils/http";
import type {
  SpotifySearchResponse,
  SpotifyUser,
  SpotifyCurrentlyPlaying,
  SpotifyTopTracksResponse,
  SpotifyAuthResponse,
} from "../types/spotify";

// Unified search hook with debouncing - searches across all connected providers
export const useSpotifySearch = (
  query: string,
  enabled: boolean = true,
  type: "track" | "artist" | "album" = "track"
) => {
  return useQuery({
    queryKey: ["search", query, type],
    queryFn: async (): Promise<SpotifySearchResponse> => {
      const params = new URLSearchParams({ q: query, type, limit: String(10) });
      return http<SpotifySearchResponse>(`/search?${params}`);
    },
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes("Authentication required")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Currently playing hook with auto-refresh
export const useCurrentlyPlaying = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["spotify", "currently-playing"],
    queryFn: () => http<SpotifyCurrentlyPlaying>(`/spotify/currently-playing`),
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 20000, // Consider stale after 20 seconds
    retry: 1,
  });
};

// Top tracks hook
export const useTopTracks = (
  timeRange: string = "medium_term",
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["spotify", "top-tracks", timeRange, limit],
    queryFn: async (): Promise<SpotifyTopTracksResponse> => {
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: String(limit),
      });
      return http<SpotifyTopTracksResponse>(`/spotify/top-tracks?${params}`);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Mutation for getting auth URL
export const useSpotifyAuth = () => {
  return useMutation({
    mutationFn: async (): Promise<SpotifyAuthResponse> =>
      http<SpotifyAuthResponse>(`/spotify/auth`),
    onSuccess: (data) => {
      // Redirect to Spotify auth
      window.location.href = data.authUrl;
    },
  });
};

// Helper to invalidate all Spotify queries (useful after auth)
export const useInvalidateSpotifyQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["spotify"] });
  };
};
