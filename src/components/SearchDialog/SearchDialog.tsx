import React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { Search, X, Loader2, Music, AlertCircle } from "lucide-react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { Text } from "../Text";
import type { SearchDialogProps } from "./types";
import { getRecentSearches, getTrendingResults } from "./utils";
import styles from "./SearchDialog.module.css";

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  searchQuery,
  onClose,
  onSearchQueryChange,
  // Data from container
  isAuthenticated,
  isCheckingAuth,
  searchResults,
  isSearching,
  searchError,
  onAuthRedirect,
}) => {
  const shouldSearch = searchQuery.length > 0;
  
  // Get fallback data
  const recentSearches = getRecentSearches();
  const trendingResults = getTrendingResults();

  const renderSearchContent = () => {
    // Show loading state while checking auth
    if (isCheckingAuth) {
      return (
        <div className={styles.searchSection}>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" size={20} />
            <Text color="muted">Checking authentication...</Text>
          </div>
        </div>
      );
    }

    // Show auth required state
    if (!isAuthenticated) {
      return (
        <div className={styles.searchSection}>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Music size={32} className="text-gray-400" />
            <Text color="muted" className="text-center">
              Connect your Spotify account to search for music
            </Text>
            <Button onClick={onAuthRedirect} variant="primary" size="sm">
              Connect Spotify
            </Button>
          </div>
        </div>
      );
    }

    // Show search results when searching
    if (shouldSearch) {
      if (isSearching) {
        return (
          <div className={styles.searchSection}>
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin mr-2" size={20} />
              <Text color="muted">Searching Spotify...</Text>
            </div>
          </div>
        );
      }

      if (searchError) {
        return (
          <div className={styles.searchSection}>
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <AlertCircle size={24} className="text-red-400" />
              <Text color="muted" className="text-center">
                Failed to search: {searchError.message}
              </Text>
              {searchError.message.includes("Authentication") && (
                <Button
                  onClick={onAuthRedirect}
                  variant="primary"
                  size="sm"
                >
                  Reconnect Spotify
                </Button>
              )}
            </div>
          </div>
        );
      }

      if (searchResults.length === 0) {
        return (
          <div className={styles.searchSection}>
            <div className="flex flex-col items-center justify-center py-8">
              <Text color="muted">
                No results found for "{searchQuery}"
              </Text>
            </div>
          </div>
        );
      }

      return (
        <div className={styles.searchSection}>
          <Text variant="overline" color="muted" as="h4">
            Search Results
          </Text>
          {searchResults.map((result) => (
            <ComboboxOption
              key={result.id}
              value={result.title}
              className={styles.searchOption}
            >
              {result.emoji} {result.title}
              {result.subtitle && ` - ${result.subtitle}`}
            </ComboboxOption>
          ))}
        </div>
      );
    }

    // Show default content (recent searches and trending)
    return (
      <>
        <div className={styles.searchSection}>
          <Text variant="overline" color="muted" as="h4">
            Recent Searches
          </Text>
          {recentSearches.map((result) => (
            <ComboboxOption
              key={result.id}
              value={result.title}
              className={styles.searchOption}
            >
              {result.emoji} {result.title}
            </ComboboxOption>
          ))}
        </div>
        <div className={styles.searchSection}>
          <Text variant="overline" color="muted" as="h4">
            Trending
          </Text>
          {trendingResults.map((result) => (
            <ComboboxOption
              key={result.id}
              value={result.title}
              className={styles.searchOption}
            >
              {result.emoji} {result.title}
              {result.subtitle && ` - ${result.subtitle}`}
            </ComboboxOption>
          ))}
        </div>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} size="lg">
      <Combobox
        value={searchQuery}
        onChange={(value) => onSearchQueryChange(value || "")}
      >
        <div className={styles.searchInputContainer}>
          <Search size={20} className={styles.searchInputIcon} />
          <ComboboxInput
            className={styles.searchComboboxInput}
            placeholder="Search for music, artists, friends..."
            onChange={(event) => onSearchQueryChange(event.target.value)}
          />
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            leftIcon={<X size={20} />}
            className={styles.searchCloseBtn}
          />
        </div>

        <ComboboxOptions className={styles.searchResults}>
          {renderSearchContent()}
        </ComboboxOptions>
      </Combobox>
    </Modal>
  );
};