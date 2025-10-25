import { useState, useEffect, useMemo } from "react";
import { useSpotifySearch, useAuthStatus } from "./useSpotify";
import { convertSpotifyTracksToSearchResults } from "../utils/spotifyUtils";
import { spotifyApi } from "../services/spotifyApi";
import type { SearchResult } from "../components/SearchDialog/types";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useSearchData = (searchQuery: string) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const shouldSearch = debouncedSearchQuery.length > 0;

  // Check if user is authenticated
  const {
    data: isAuthenticated,
    isLoading: isCheckingAuth,
    error: authError,
  } = useAuthStatus();

  // Search for tracks when query is provided
  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useSpotifySearch(debouncedSearchQuery, shouldSearch && isAuthenticated);

  // Convert Spotify results to SearchResult format
  const searchResults: SearchResult[] = useMemo(() => {
    if (!searchResponse?.results?.tracks?.items) return [];
    return convertSpotifyTracksToSearchResults(
      searchResponse.results.tracks.items.slice(0, 10) // Limit to 10 results
    );
  }, [searchResponse]);

  // Handle authentication redirect
  const handleAuthRedirect = async () => {
    try {
      const authResponse = await spotifyApi.getAuthUrl();
      window.location.href = authResponse.authUrl;
    } catch (error) {
      console.error("Failed to get Spotify auth URL:", error);
    }
  };

  return {
    // Auth state
    isAuthenticated: isAuthenticated ?? false,
    isCheckingAuth,
    authError,
    // Search state
    searchResults,
    isSearching,
    searchError,
    // Actions
    onAuthRedirect: handleAuthRedirect,
  };
};
