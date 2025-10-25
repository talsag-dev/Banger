import React from "react";
import { Button } from "../Button";
import { Text } from "../Text";
import type { SidebarProps, QuickActionType } from "./types";
import {
  getTrendingData,
  getActiveFriends,
  getQuickActionConfig,
  handleQuickAction,
} from "./utils";
import styles from "./Sidebar.module.css";

export const Sidebar: React.FC<SidebarProps> = ({
  onQuickAction,
  onTrendingClick,
  onFriendClick,
  isSpotifyConnected = false,
  isAppleConnected = false,
}) => {
  const trendingData = getTrendingData();
  const activeFriends = getActiveFriends();
  
  // Filter out connected services from quick actions
  const allQuickActions: QuickActionType[] = [
    "connect-spotify",
    "connect-apple", 
    "share-music",
  ];
  
  const quickActions = allQuickActions.filter(action => {
    if (action === "connect-spotify" && isSpotifyConnected) return false;
    if (action === "connect-apple" && isAppleConnected) return false;
    return true;
  });

  const handleQuickActionClick = async (action: QuickActionType) => {
    try {
      await handleQuickAction(action);
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
          Quick Actions
        </Text>
        <div className={styles.quickActions}>
          {quickActions.map((action) => {
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
          })}
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
