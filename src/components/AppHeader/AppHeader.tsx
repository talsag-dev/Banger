import React, { useState } from "react";
import { Search, Plus, User, Bell } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Button } from "../Button";
import { Text } from "../Text";
import { useAuth } from "../../hooks/useAuth";
import { LoginModal } from "../Auth/LoginModal";
import type { AppHeaderProps } from "./types";
import styles from "./AppHeader.module.css";

export const AppHeader: React.FC<AppHeaderProps> = ({
  onSearchClick,
  onNewPostClick,
  onSettingsClick,
  onProfileClick,
  onHomeClick,
}) => {
  const { logout, isAuthenticated, user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      // Optionally redirect to home or login page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
      // Could show toast notification here
    }
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

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
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName || "User"}
                  className={styles.userAvatar}
                />
              ) : (
                <User size={20} />
              )}
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
                  {isAuthenticated && user ? (
                    <>
                      <div className={styles.userInfo}>
                        <Text variant="body" weight="medium">
                          {user.displayName || "User"}
                        </Text>
                        {user.email && (
                          <Text variant="caption" color="muted">
                            {user.email}
                          </Text>
                        )}
                      </div>
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
                        onClick={() => {
                          close();
                          handleSignOut();
                        }}
                        className={styles.menuButton}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className={styles.userInfo}>
                        <Text variant="body" weight="medium">
                          Welcome to Banger
                        </Text>
                        <Text variant="caption" color="muted">
                          Sign in to share your music
                        </Text>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          close();
                          handleLoginClick();
                        }}
                        className={styles.menuButton}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          close();
                          handleLoginClick();
                        }}
                        className={styles.menuButton}
                      >
                        Create Account
                      </Button>
                    </>
                  )}
                </div>
              )}
            </PopoverPanel>
          </Popover>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </header>
  );
};
