import { useReducer, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { NewPostModal } from "@components/NewPostModal";
import { DeletePostModal } from "@components/DeletePostModal";
import { useAuth } from "@hooks/useAuth";
import { useProfileData } from "@hooks/useProfileData";
import { useDeletePost } from "@hooks/useDeletePost";
import type { ProfileState, ProfileAction, ProfileTab } from "./types";
import type { MusicPost } from "@types";
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
    { activeTab, isNewPostOpen, postToEdit, postToDelete, isDeleteModalOpen },
    dispatch,
  ] = useReducer(profileReducer, {
    activeTab: initialTab,
    isNewPostOpen: false,
    postToEdit: null,
    postToDelete: null,
    isDeleteModalOpen: false,
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

  const handleFollowToggle = () => {
    if (!userProfile || isOwnProfile) return;
    // Optimistic update - you might want to make an API call here
    // For now, we'll just toggle the local state
    // This would need to be handled in the hook if you want to persist it
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
    </>
  );
};
