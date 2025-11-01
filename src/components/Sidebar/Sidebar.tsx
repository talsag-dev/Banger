import React from "react";
import { Button } from "../Button";
import { Text } from "../Text";
import { useAuth } from "../../hooks/useAuth";
import type { SidebarProps, QuickActionType } from "./types";
import {
  getTrendingData,
  getActiveFriends,
  getQuickActionConfig,
  handleQuickAction,
} from "./utils";
import styles from "./Sidebar.module.css";

export const Sidebar: React.FC<
  Omit<SidebarProps, "isSpotifyConnected" | "isAppleConnected"> & {
    onQuickAction?: (action: QuickActionType) => void;
  }
> = ({ onQuickAction, onTrendingClick, onFriendClick }) => {
  const {
    isAuthenticated,
    isLoading,
    musicIntegrations,
    connectSpotify,
    connectAppleMusic,
    connectYouTubeMusic,
    connectSoundCloud,
  } = useAuth();
  const trendingData = getTrendingData();
  const activeFriends = getActiveFriends();

  // Show different quick actions based on authentication status
  const getQuickActions = (): QuickActionType[] => {
    const actions: QuickActionType[] = [];

    // Check both isConnected AND hasValidToken (token might have expired)
    const spotify = musicIntegrations?.spotify;
    if (!spotify?.isConnected || !spotify?.hasValidToken) {
      actions.push("connect-spotify");
    }

    const appleMusic = musicIntegrations?.["apple-music"];
    if (!appleMusic?.isConnected || !appleMusic?.hasValidToken) {
      actions.push("connect-apple");
    }

    const youtubeMusic = musicIntegrations?.["youtube-music"];
    if (!youtubeMusic?.isConnected || !youtubeMusic?.hasValidToken) {
      actions.push("connect-youtube");
    }

    const soundcloud = musicIntegrations?.soundcloud;
    if (!soundcloud?.isConnected || !soundcloud?.hasValidToken) {
      actions.push("connect-soundcloud");
    }

    return actions;
  };

  const quickActions = getQuickActions();

  const handleQuickActionClick = async (action: QuickActionType) => {
    try {
      await handleQuickAction(
        action,
        connectSpotify,
        connectAppleMusic,
        connectYouTubeMusic,
        connectSoundCloud
      );
      onQuickAction?.(action);
    } catch {
      // Handle error state - could show toast notification
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarSection}>
        <Text variant="subtitle" as="h3">
          Trending Now
        </Text>
        <div className={styles.trendingList}>
          {trendingData.map((item) => (
            <div
              key={item.id}
              className={styles.trendingItem}
              onClick={() => onTrendingClick?.(item.id)}
            >
              <span className={styles.trendingEmoji}>{item.emoji}</span>
              <Text variant="body">{item.title}</Text>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebarSection}>
        <Text variant="subtitle" as="h3">
          {isAuthenticated ? "Connect Music Services" : "Quick Actions"}
        </Text>
        {isAuthenticated && quickActions.length > 1 && (
          <Text
            variant="caption"
            color="secondary"
            className={styles.sectionDescription}
          >
            Connect your music platforms to sync playlists and discover new
            music
          </Text>
        )}
        <div className={styles.quickActions}>
          {isLoading ? (
            <Text variant="caption" color="secondary">
              Loading...
            </Text>
          ) : (
            quickActions.map((action) => {
              const config = getQuickActionConfig(action);
              return (
                <Button
                  key={action}
                  size="sm"
                  fullWidth
                  onClick={() => handleQuickActionClick(action)}
                >
                  {config.text}
                </Button>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.sidebarSection}>
        <Text variant="subtitle" as="h3">
          Active Friends
        </Text>
        <div className={styles.activeFriends}>
          {activeFriends.map((friend) => (
            <div
              key={friend.id}
              className={styles.friendItem}
              onClick={() => onFriendClick?.(friend.id)}
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                className={styles.friendAvatar}
              />
              <div className={styles.friendInfo}>
                <Text variant="body" className={styles.friendName}>
                  {friend.name}
                </Text>
                <Text
                  variant="caption"
                  color="secondary"
                  className={styles.friendStatus}
                >
                  {friend.status}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
