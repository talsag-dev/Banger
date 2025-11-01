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
  onFollowToggle: () => void | Promise<void>;
  onEditPost?: (post: MusicPost) => void;
  onDeletePost?: (postId: string) => void;
}

export interface ProfileState {
  activeTab: ProfileTab;
  isNewPostOpen: boolean;
  postToEdit: MusicPost | null;
  postToDelete: MusicPost | null;
  isDeleteModalOpen: boolean;
}

export type ProfileAction =
  | { type: "SET_ACTIVE_TAB"; payload: ProfileTab }
  | { type: "OPEN_NEW_POST" }
  | { type: "CLOSE_NEW_POST" }
  | { type: "SET_POST_TO_EDIT"; payload: MusicPost }
  | { type: "CLEAR_POST_TO_EDIT" }
  | { type: "OPEN_DELETE_MODAL"; payload: MusicPost }
  | { type: "CLOSE_DELETE_MODAL" }
  | { type: "CLEAR_POST_TO_DELETE" };
