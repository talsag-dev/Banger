import React from "react";
import { Search, Plus, User, Bell } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Button } from "../Button";
import { Text } from "../Text";
import type { AppHeaderProps } from "./types";
import styles from "./AppHeader.module.css";

export const AppHeader: React.FC<AppHeaderProps> = ({
  onSearchClick,
  onNewPostClick,
  onSettingsClick,
  onProfileClick,
  onHomeClick,
}) => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <div className={styles.appTitleContainer} onClick={onHomeClick}>
          <Text
            variant="title"
            weight="bold"
            as="h1"
            className={styles.appTitle}
          >
            Banger
          </Text>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchContainer} onClick={onSearchClick}>
            <Search size={16} className={styles.searchIcon} />
            <Text
              variant="caption"
              color="muted"
              className={styles.searchPlaceholder}
            >
              Search music, friends, or feelings...
            </Text>
          </div>
          <Button
            onClick={onSearchClick}
            variant="icon"
            size="sm"
            leftIcon={<Search size={20} />}
            className={styles.mobileSearchBtn}
          />
          <Button
            onClick={onNewPostClick}
            variant="icon"
            size="sm"
            leftIcon={<Plus size={20} />}
          />
          <Button variant="icon" size="sm" leftIcon={<Bell size={20} />} />
          <Popover className={styles.userMenuPopover}>
            <PopoverButton as={Button} variant="icon" size="sm">
              <User size={20} />
            </PopoverButton>
            <PopoverPanel
              anchor={{
                to: "bottom end",
                gap: 8,
              }}
              className={styles.userMenuPanel}
            >
              {({ close }) => (
                <div className={styles.userMenuItems}>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      close();
                      onProfileClick();
                    }}
                    className={styles.menuButton}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      close();
                      onSettingsClick();
                    }}
                    className={styles.menuButton}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => close}
                    className={styles.menuButton}
                  >
                    Help
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => close}
                    className={styles.menuButton}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </PopoverPanel>
          </Popover>
        </div>
      </div>
    </header>
  );
};
