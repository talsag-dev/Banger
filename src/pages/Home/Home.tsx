import { FeedContainer } from "@components/FeedContainer";
import type { MusicPost } from "@types";
import { NewPostModal } from "@components/NewPostModal";
import { DeletePostModal } from "@components/DeletePostModal";
import { useReducer } from "react";
import { useFeed } from "@hooks/useFeed";
import { useDeletePost } from "@hooks/useDeletePost";

interface FeedContainerState {
  isNewPostOpen: boolean;
  postToEdit: MusicPost | null;
  postToDelete: MusicPost | null;
  isDeleteModalOpen: boolean;
}

type FeedContainerAction =
  | { type: "OPEN_NEW_POST" }
  | { type: "CLOSE_NEW_POST" }
  | { type: "SET_POST_TO_EDIT"; payload: MusicPost }
  | { type: "CLEAR_POST_TO_EDIT" }
  | { type: "OPEN_DELETE_MODAL"; payload: MusicPost }
  | { type: "CLOSE_DELETE_MODAL" }
  | { type: "CLEAR_POST_TO_DELETE" };

const initialState: FeedContainerState = {
  isNewPostOpen: false,
  postToEdit: null,
  postToDelete: null,
  isDeleteModalOpen: false,
};

const feedContainerReducer = (
  state: FeedContainerState,
  action: FeedContainerAction
): FeedContainerState => {
  switch (action.type) {
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

export const Home: React.FC = () => {
  const [
    { isNewPostOpen, postToEdit, postToDelete, isDeleteModalOpen },
    dispatch,
  ] = useReducer(feedContainerReducer, initialState);
  const { data: feed, isLoading, error } = useFeed();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

  const handleReaction = (postId: string, reaction: string) => {
    console.error("Failed to add reaction:", { postId, reaction });
  };

  const handleComment = (postId: string, comment: string) => {
    console.error("Failed to add comment:", { postId, comment });
  };

  const handleEdit = (post: MusicPost) => {
    dispatch({ type: "SET_POST_TO_EDIT", payload: post });
    dispatch({ type: "OPEN_NEW_POST" });
  };

  const handleDelete = (postId: string) => {
    const post = feed?.posts.find((p) => p.id === postId);
    if (post) {
      dispatch({ type: "OPEN_DELETE_MODAL", payload: post });
    }
  };

  const handleConfirmDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      dispatch({ type: "CLOSE_DELETE_MODAL" });
      // Clear post after modal closes
      setTimeout(() => {
        dispatch({ type: "CLEAR_POST_TO_DELETE" });
      }, 300);
    } catch (error) {
      console.error("Failed to delete post:", error);
      // Close modal even on error
      dispatch({ type: "CLOSE_DELETE_MODAL" });
    }
  };

  return (
    <>
      <FeedContainer
        feed={feed}
        isLoading={isLoading}
        error={error}
        onReaction={handleReaction}
        onComment={handleComment}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDiscoverPeople={() => {
          console.log("Discover people clicked");
        }}
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
          setTimeout(() => {
            dispatch({ type: "CLEAR_POST_TO_DELETE" });
          }, 300);
        }}
        onConfirm={handleConfirmDelete}
        postId={postToDelete?.id ?? null}
        isDeleting={isDeleting}
      />
    </>
  );
};
