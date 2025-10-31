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
    if (!isAuthenticated) {
      return ["share-music"];
    }

    // For authenticated users, show music service connections that aren't connected yet
    const actions: QuickActionType[] = [];

    if (!musicIntegrations?.spotify?.isConnected) {
      actions.push("connect-spotify");
    }
    if (!musicIntegrations?.["apple-music"]?.isConnected) {
      actions.push("connect-apple");
    }
    if (!musicIntegrations?.["youtube-music"]?.isConnected) {
      actions.push("connect-youtube");
    }
    if (!musicIntegrations?.soundcloud?.isConnected) {
      actions.push("connect-soundcloud");
    }

    // Always show share music option
    actions.push("share-music");

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
          ) : quickActions.length === 1 && quickActions[0] === "share-music" ? (
            <Text variant="caption" color="secondary">
              🎉 All music services connected!
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
