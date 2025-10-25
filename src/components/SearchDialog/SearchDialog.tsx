import React from "react";
import {
  Dialog,
  DialogPanel,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Search, X } from "lucide-react";
import { Button } from "../Button";
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
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className={styles.searchDialog}>
        <TransitionChild
          enter={styles.searchBackdropEnter}
          enterFrom={styles.searchBackdropEnterFrom}
          enterTo={styles.searchBackdropEnterTo}
          leave={styles.searchBackdropLeave}
          leaveFrom={styles.searchBackdropLeaveFrom}
          leaveTo={styles.searchBackdropLeaveTo}
        >
          <div className={styles.searchBackdrop} />
        </TransitionChild>

        <div className={styles.searchDialogContainer}>
          <TransitionChild
            enter={styles.searchPanelEnter}
            enterFrom={styles.searchPanelEnterFrom}
            enterTo={styles.searchPanelEnterTo}
            leave={styles.searchPanelLeave}
            leaveFrom={styles.searchPanelLeaveFrom}
            leaveTo={styles.searchPanelLeaveTo}
          >
            <DialogPanel className={styles.searchPanel}>
              <Combobox
                value={searchQuery}
                onChange={(value) => onSearchQueryChange(value || "")}
              >
                <div className={styles.searchInputContainer}>
                  <Search size={20} className={styles.searchInputIcon} />
                  <ComboboxInput
                    className={styles.searchComboboxInput}
                    placeholder="Search for music, artists, friends..."
                    onChange={(event) =>
                      onSearchQueryChange(event.target.value)
                    }
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
                    <h4>Recent Searches</h4>
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
                    <h4>Trending</h4>
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
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
