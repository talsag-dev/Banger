import type { MusicPost, Playlist, UserProfile } from "@types";

export type ProfileTab = "posts" | "liked" | "playlists";

export interface ProfileProps {
  userProfile: UserProfile | null;
  userPosts: MusicPost[];
  likedPosts: MusicPost[];
  playlists: Playlist[];
  isLoading: boolean;
  isLoadingLiked: boolean;
  isLoadingPlaylists: boolean;
  isOwnProfile: boolean;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onFollowToggle: () => void;
}

export interface ProfileState {
  activeTab: ProfileTab;
}

export type ProfileAction = {
  type: "SET_ACTIVE_TAB";
  payload: ProfileTab;
};
