import { useQuery } from "@tanstack/react-query";
import { http } from "@utils/http";
import type { UserProfile, MusicPost, Playlist } from "@types";
import type { ProfileTab } from "@pages/Profile/types";

export interface UseProfileDataProps {
  userProfile: UserProfile | null;
  userPosts: MusicPost[];
  likedPosts: MusicPost[];
  playlists: Playlist[];
  isLoading: boolean;
  isLoadingLiked: boolean;
  isLoadingPlaylists: boolean;
}

export const useProfileData = (
  userId: string | undefined,
  activeTab: ProfileTab
): UseProfileDataProps => {
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const profile = await http<UserProfile>(`/users/${userId}/profile`);
      const postsData = await http<{ posts: MusicPost[] }>(
        `/posts/user/${userId}`
      );
      return {
        profile,
        posts: postsData.posts || [],
      };
    },
    enabled: !!userId,
  });

  const { data: likedPosts = [], isLoading: isLoadingLiked } = useQuery({
    queryKey: ["likedPosts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const likedData = await http<{ posts: MusicPost[] }>(
        `/posts/user/${userId}/liked`
      );
      return likedData.posts || [];
    },
    enabled: !!userId && activeTab === "liked",
  });

  // Fetch playlists (enabled when activeTab is "playlists")
  const { data: playlists = [], isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ["playlists", userId],
    queryFn: async () => {
      if (!userId) return [];
      const playlistsData = await http<{ playlists: Playlist[] }>(
        `/users/${userId}/playlists`
      );
      return playlistsData.playlists || [];
    },
    enabled: !!userId && activeTab === "playlists",
  });

  return {
    userProfile: profileData?.profile || null,
    userPosts: profileData?.posts || [],
    likedPosts,
    playlists,
    isLoading: isLoadingProfile,
    isLoadingLiked,
    isLoadingPlaylists,
  };
};
