import React from "react";
import { Search, Plus, User, Bell } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Button } from "../Button";
import type { AppHeaderProps } from "./types";
import styles from "./AppHeader.module.css";

export const AppHeader: React.FC<AppHeaderProps> = ({
  onSearchClick,
  onNewPostClick,
  onSettingsClick,
}) => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.appTitle}>Banger</h1>
        <div className={styles.headerActions}>
          <button onClick={onSearchClick} className={styles.searchContainer}>
            <Search size={20} className="search-icon" />
            <span className={styles.searchPlaceholder}>
              Search music, friends, or feelings...
            </span>
          </button>
          <Button 
            onClick={onNewPostClick} 
            variant="ghost" 
            size="sm"
            leftIcon={<Plus size={20} />}
            className={styles.headerBtn}
          />
          <Button 
            variant="ghost" 
            size="sm"
            leftIcon={<Bell size={20} />}
            className={styles.headerBtn}
          />
          <Popover className={styles.userMenuPopover}>
            <PopoverButton className={styles.userMenuButton}>
              <User size={20} />
            </PopoverButton>
            <PopoverPanel 
              anchor={{
                to: "bottom end",
                gap: 8
              }}
              className={styles.userMenuPanel}
            >
              <div className={styles.userMenuItems}>
                <Button variant="ghost" size="sm" fullWidth className={styles.userMenuItem}>
                  Profile
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  fullWidth
                  className={styles.userMenuItem}
                  onClick={onSettingsClick}
                >
                  Settings
                </Button>
                <Button variant="ghost" size="sm" fullWidth className={styles.userMenuItem}>
                  Help
                </Button>
                <hr className={styles.userMenuSeparator} />
                <Button variant="ghost" size="sm" fullWidth className={styles.userMenuItem}>
                  Sign Out
                </Button>
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </div>
    </header>
  );
};
