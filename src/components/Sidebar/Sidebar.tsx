import React from "react";
import { Button } from "../Button";
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
}) => {
  const trendingData = getTrendingData();
  const activeFriends = getActiveFriends();
  const quickActions: QuickActionType[] = [
    "connect-spotify",
    "connect-apple",
    "share-music",
  ];

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
        <h3>Trending Now</h3>
        <div className={styles.trendingList}>
          {trendingData.map((item) => (
            <div
              key={item.id}
              className={styles.trendingItem}
              onClick={() => onTrendingClick?.(item.id)}
            >
              <span className={styles.trendingEmoji}>{item.emoji}</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebarSection}>
        <h3>Quick Actions</h3>
        <div className={styles.quickActions}>
          {quickActions.map((action) => {
            const config = getQuickActionConfig(action);
            return (
              <Button
                key={action}
                size="sm"
                fullWidth
                className={`${styles.quickActionBtn} ${
                  styles[config.className]
                }`}
                onClick={() => handleQuickActionClick(action)}
              >
                {config.text}
              </Button>
            );
          })}
        </div>
      </div>

      <div className={styles.sidebarSection}>
        <h3>Active Friends</h3>
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
                <span className={styles.friendName}>{friend.name}</span>
                <span className={styles.friendStatus}>{friend.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
