import { useReducer, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { NewPostModal } from "@components/NewPostModal";
import { DeletePostModal } from "@components/DeletePostModal";
import { PlaylistDetailModal } from "@components/PlaylistDetailModal";
import { useAuth } from "@hooks/useAuth";
import { useProfileData } from "@hooks/useProfileData";
import { useDeletePost } from "@hooks/useDeletePost";
import { useToggleFollow } from "@hooks/useFollowUser";
import type { ProfileState, ProfileAction, ProfileTab } from "./types";
import type { MusicPost, Playlist } from "@types";
import { getInitialTabFromUrl } from "@utils/getInitialTab";
import { ProfileBody } from "./ProfileBody";

const profileReducer = (
  state: ProfileState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "OPEN_NEW_POST":
      return { ...state, isNewPostOpen: true };
    case "CLOSE_NEW_POST":
      return { ...state, isNewPostOpen: false };
    case "SET_POST_TO_EDIT":
      return { ...state, postToEdit: action.payload };
    case "CLEAR_POST_TO_EDIT":
      return { ...state, postToEdit: null };
    case "OPEN_DELETE_MODAL":
      return {
        ...state,
        postToDelete: action.payload,
        isDeleteModalOpen: true,
      };
    case "CLOSE_DELETE_MODAL":
      return { ...state, isDeleteModalOpen: false };
    case "CLEAR_POST_TO_DELETE":
      return { ...state, postToDelete: null };
    case "OPEN_PLAYLIST_MODAL":
      return {
        ...state,
        selectedPlaylist: action.payload,
        isPlaylistModalOpen: true,
      };
    case "CLOSE_PLAYLIST_MODAL":
      return {
        ...state,
        isPlaylistModalOpen: false,
        selectedPlaylist: null,
      };
    default:
      return state;
  }
};

export const Profile = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId: userIdParam } = useParams<{ userId?: string }>();
  const userId = userIdParam ?? user?.id ?? "";
  const isOwnProfile = userId === user?.id;

  const initialTab = getInitialTabFromUrl(searchParams);

  const [
    {
      activeTab,
      isNewPostOpen,
      postToEdit,
      postToDelete,
      isDeleteModalOpen,
      selectedPlaylist,
      isPlaylistModalOpen,
    },
    dispatch,
  ] = useReducer(profileReducer, {
    activeTab: initialTab,
    isNewPostOpen: false,
    postToEdit: null,
    postToDelete: null,
    isDeleteModalOpen: false,
    selectedPlaylist: null,
    isPlaylistModalOpen: false,
  });

  // Sync state with URL param when URL changes (browser back/forward)
  useEffect(() => {
    const urlTab = getInitialTabFromUrl(searchParams);
    if (urlTab !== activeTab) {
      dispatch({ type: "SET_ACTIVE_TAB", payload: urlTab });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const {
    userProfile,
    userPosts,
    likedPosts,
    playlists,
    isLoading,
    isLoadingLiked,
    isLoadingPlaylists,
  } = useProfileData(userId, activeTab);

  const { mutateAsync: toggleFollow } = useToggleFollow();

  const handleFollowToggle = async () => {
    if (!userProfile || isOwnProfile) return;

    try {
      await toggleFollow({
        userId: userProfile.id,
        type: userProfile.isFollowing ? "unfollow" : "follow",
      });
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const handleTabChange = (tab: ProfileTab) => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });

    // Update URL when user manually changes tab
    if (tab !== "posts") {
      setSearchParams({ tab }, { replace: true });
    } else {
      // Remove tab param if it's "posts" (default)
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("tab");
      setSearchParams(newParams, { replace: true });
    }
  };

  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

  const handleEditPost = (post: MusicPost) => {
    dispatch({ type: "SET_POST_TO_EDIT", payload: post });
    dispatch({ type: "OPEN_NEW_POST" });
  };

  const handleDeletePost = (postId: string) => {
    const post =
      userPosts.find((p) => p.id === postId) ||
      likedPosts.find((p) => p.id === postId);
    if (post) {
      dispatch({ type: "OPEN_DELETE_MODAL", payload: post });
    }
  };

  const handleConfirmDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      dispatch({ type: "CLOSE_DELETE_MODAL" });
      dispatch({ type: "CLEAR_POST_TO_DELETE" });
    } catch (error) {
      console.error("Failed to delete post:", error);
      dispatch({ type: "CLOSE_DELETE_MODAL" });
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    dispatch({ type: "OPEN_PLAYLIST_MODAL", payload: playlist });
  };

  return (
    <>
      <ProfileBody
        userProfile={userProfile}
        userPosts={userPosts}
        likedPosts={likedPosts}
        playlists={playlists}
        isLoading={isLoading}
        isLoadingLiked={isLoadingLiked}
        isLoadingPlaylists={isLoadingPlaylists}
        isOwnProfile={isOwnProfile}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onFollowToggle={handleFollowToggle}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onPlaylistClick={handlePlaylistClick}
      />
      <NewPostModal
        isOpen={isNewPostOpen}
        onClose={() => {
          dispatch({ type: "CLOSE_NEW_POST" });
        }}
        onPostCreated={() => {
          dispatch({ type: "CLOSE_NEW_POST" });
        }}
        onPostUpdated={() => {
          dispatch({ type: "CLOSE_NEW_POST" });
        }}
        post={postToEdit}
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          dispatch({ type: "CLOSE_DELETE_MODAL" });
          dispatch({ type: "CLEAR_POST_TO_DELETE" });
        }}
        onConfirm={handleConfirmDelete}
        postId={postToDelete?.id ?? null}
        isDeleting={isDeleting}
      />

      <PlaylistDetailModal
        isOpen={isPlaylistModalOpen}
        onClose={() => {
          dispatch({ type: "CLOSE_PLAYLIST_MODAL" });
        }}
        playlist={selectedPlaylist}
        userId={userId}
      />
    </>
  );
};
