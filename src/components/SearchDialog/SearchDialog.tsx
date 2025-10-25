import React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { Search, X } from "lucide-react";
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
}) => {
  const recentSearches = getRecentSearches();
  const trendingResults = getTrendingResults();

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
        </ComboboxOptions>
      </Combobox>
    </Modal>
  );
};
