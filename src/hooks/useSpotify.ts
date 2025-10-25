import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { spotifyApi } from "../services/spotifyApi";

// Search hook with debouncing
export const useSpotifySearch = (
  query: string,
  enabled: boolean = true,
  type: "track" | "artist" | "album" = "track"
) => {
  return useQuery({
    queryKey: ["spotify", "search", query, type],
    queryFn: () => spotifyApi.search(query, type, 10), // Limit to 10 results
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

// User profile hook
export const useSpotifyProfile = () => {
  return useQuery({
    queryKey: ["spotify", "profile"],
    queryFn: () => spotifyApi.getProfile(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("Authentication required")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Currently playing hook with auto-refresh
export const useCurrentlyPlaying = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["spotify", "currently-playing"],
    queryFn: () => spotifyApi.getCurrentlyPlaying(),
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
    queryFn: () => spotifyApi.getTopTracks(timeRange, limit),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Auth status hook
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ["spotify", "auth-status"],
    queryFn: () => spotifyApi.checkAuthStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Mutation for getting auth URL
export const useSpotifyAuth = () => {
  return useMutation({
    mutationFn: () => spotifyApi.getAuthUrl(),
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
