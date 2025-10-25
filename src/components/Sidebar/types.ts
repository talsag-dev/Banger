export interface SidebarProps {
  onQuickAction?: (action: QuickActionType) => void;
  onTrendingClick?: (trendingId: string) => void;
  onFriendClick?: (friendId: string) => void;
  isSpotifyConnected?: boolean;
  isAppleConnected?: boolean;
}

export interface TrendingItem {
  id: string;
  emoji: string;
  title: string;
  description?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isOnline?: boolean;
}

export type QuickActionType =
  | "connect-spotify"
  | "connect-apple"
  | "share-music";
