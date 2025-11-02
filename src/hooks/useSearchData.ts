import { useState, useEffect, useMemo } from "react";
import { useUserSearch } from "./useUserSearch";
import type { SearchResult } from "../components/SearchDialog/types";
import { useAuth } from "./useAuth";

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
    isAuthenticated,
    isLoading: isCheckingAuth,
    error: authError,
  } = useAuth();

  // Search for users when query is provided
  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useUserSearch(debouncedSearchQuery, shouldSearch && isAuthenticated);

  // Convert user results to SearchResult format
  const searchResults: SearchResult[] = useMemo(() => {
    if (!searchResponse?.users || !Array.isArray(searchResponse.users))
      return [];

    return searchResponse.users.map((user) => {
      // Determine title (prefer username, then displayName, then email)
      const title = user.username || user.displayName || user.email || "User";

      // Determine subtitle
      // If username exists: show displayName if different, or email
      // If no username: show email if we're showing displayName as title
      let subtitle: string | undefined;
      if (user.username) {
        subtitle =
          user.displayName && user.displayName !== user.username
            ? user.displayName
            : user.email || undefined;
      } else if (user.displayName && user.email) {
        subtitle = user.email;
      }

      return {
        id: user.id,
        type: "user" as const,
        title,
        subtitle,
        emoji: "👤",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
        },
      };
    });
  }, [searchResponse]);

  // No auth redirect needed for user search

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
  };
};
