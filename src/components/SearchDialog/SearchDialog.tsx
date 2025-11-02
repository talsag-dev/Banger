import { useNavigate } from "react-router-dom";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { Text } from "../Text";
import type { SearchDialogProps } from "./types";
import styles from "./SearchDialog.module.css";

export const SearchDialog = ({
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
}: SearchDialogProps) => {
  const navigate = useNavigate();
  const shouldSearch = searchQuery.length > 0;

  const handleUserSelect = (value: string | null) => {
    if (value && value.startsWith("/profile/")) {
      navigate(value);
      onClose();
    } else {
      onSearchQueryChange(value || "");
    }
  };

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
            <Text color="muted" className="text-center">
              Please sign in to search for users
            </Text>
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
              <Text color="muted">Searching users...</Text>
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
            </div>
          </div>
        );
      }

      if (searchResults.length === 0) {
        return (
          <div className={styles.searchSection}>
            <div className="flex flex-col items-center justify-center py-8">
              <Text color="muted">No results found for "{searchQuery}"</Text>
            </div>
          </div>
        );
      }

      return (
        <div className={styles.searchSection}>
          <Text variant="overline" color="muted" as="h4">
            Search Results
          </Text>
          <div className={styles.searchResultsList}>
            {searchResults.map((result) => (
              <ComboboxOption
                key={result.id}
                value={
                  result.user ? `/profile/${result.user.id}` : result.title
                }
                className={styles.searchOption}
              >
                {result.user ? (
                  <div className={styles.userResult}>
                    <img
                      src={
                        result.user.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.id}`
                      }
                      alt={result.title}
                      className={styles.userAvatar}
                    />
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{result.title}</div>
                      {result.subtitle && (
                        <div className={styles.userSubtitle}>
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {result.emoji} {result.title}
                    {result.subtitle && ` - ${result.subtitle}`}
                  </>
                )}
              </ComboboxOption>
            ))}
          </div>
        </div>
      );
    }

    // Show default content - for now, show helpful message since we only search users
    // TODO: When feelings/playlists search is implemented, uncomment the sections below
    return (
      <div className={styles.searchSection}>
        <Text color="muted" className={styles.emptyState}>
          Search for users by username, email, or display name
        </Text>
        {/* TODO: Re-enable when feelings/playlists search is implemented
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
        */}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="md"
      className={styles.searchModal}
    >
      <div className={styles.searchDialogWrapper}>
        <Combobox value={searchQuery} onChange={handleUserSelect}>
          <div className={styles.searchInputContainer}>
            <Search size={20} className={styles.searchInputIcon} />
            <ComboboxInput
              className={styles.searchComboboxInput}
              placeholder="Search for users by username, email, or name..."
              onChange={(event) => onSearchQueryChange(event.target.value)}
              autoFocus
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
      </div>
    </Modal>
  );
};
