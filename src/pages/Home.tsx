import React, { useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "../components/AppHeader";
import { SearchDialog } from "../components/SearchDialog";
import { NewPostModal } from "../components/NewPostModal";
import { SettingsModal } from "../components/SettingsModal";
import { Sidebar } from "../components/Sidebar";
import { FeedContainer } from "../components/FeedContainer";
import { useSearchData } from "../hooks/useSearchData";
import type { Feed } from "../types/music";
import "./Home.css";

// State type for our reducer
interface HomeState {
  isSearchOpen: boolean;
  isNewPostOpen: boolean;
  isSettingsOpen: boolean;
  searchQuery: string;
}

// Action types
type HomeAction =
  | { type: "OPEN_SEARCH" }
  | { type: "CLOSE_SEARCH" }
  | { type: "OPEN_NEW_POST" }
  | { type: "CLOSE_NEW_POST" }
  | { type: "OPEN_SETTINGS" }
  | { type: "CLOSE_SETTINGS" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "RESET_SEARCH" };

// Initial state
const initialState: HomeState = {
  isSearchOpen: false,
  isNewPostOpen: false,
  isSettingsOpen: false,
  searchQuery: "",
};

// Reducer function
const homeReducer = (state: HomeState, action: HomeAction): HomeState => {
  switch (action.type) {
    case "OPEN_SEARCH":
      return { ...state, isSearchOpen: true };
    case "CLOSE_SEARCH":
      return { ...state, isSearchOpen: false };
    case "OPEN_NEW_POST":
      return { ...state, isNewPostOpen: true };
    case "CLOSE_NEW_POST":
      return { ...state, isNewPostOpen: false };
    case "OPEN_SETTINGS":
      return { ...state, isSettingsOpen: true };
    case "CLOSE_SETTINGS":
      return { ...state, isSettingsOpen: false };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "RESET_SEARCH":
      return { ...state, searchQuery: "", isSearchOpen: false };
    default:
      return state;
  }
};

const fetchFeed = async (): Promise<Feed> => {
  const response = await fetch("/api/feed");
  if (!response.ok) {
    throw new Error("Failed to fetch feed");
  }
  return response.json();
};

export const Home: React.FC = () => {
  const [
    { isNewPostOpen, isSearchOpen, isSettingsOpen, searchQuery },
    dispatch,
  ] = useReducer(homeReducer, initialState);

  // Search data and logic
  const {
    isAuthenticated,
    isCheckingAuth,
    authError,
    searchResults,
    isSearching,
    searchError,
    onAuthRedirect,
  } = useSearchData(searchQuery);

  const {
    data: feed,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
  });

  const handleReaction = async (postId: string, type: string) => {
    try {
      await fetch(`/api/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      // In a real app, you'd refetch the data or update the cache
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      // In a real app, you'd refetch the data or update the cache
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="home-container">
      <AppHeader
        onSearchClick={() => dispatch({ type: "OPEN_SEARCH" })}
        onNewPostClick={() => dispatch({ type: "OPEN_NEW_POST" })}
        onSettingsClick={() => dispatch({ type: "OPEN_SETTINGS" })}
      />

      <SearchDialog
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        onClose={() => dispatch({ type: "CLOSE_SEARCH" })}
        onSearchQueryChange={(query) =>
          dispatch({ type: "SET_SEARCH_QUERY", payload: query })
        }
        // Search data from hook
        isAuthenticated={isAuthenticated}
        isCheckingAuth={isCheckingAuth}
        authError={authError}
        searchResults={searchResults}
        isSearching={isSearching}
        searchError={searchError}
        onAuthRedirect={onAuthRedirect}
      />

      <NewPostModal
        isOpen={isNewPostOpen}
        onClose={() => dispatch({ type: "CLOSE_NEW_POST" })}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => dispatch({ type: "CLOSE_SETTINGS" })}
      />

      <main className="main-content">
        <FeedContainer
          feed={feed}
          isLoading={isLoading}
          error={error}
          onReaction={handleReaction}
          onComment={handleComment}
        />

        <Sidebar />
      </main>
    </div>
  );
};
