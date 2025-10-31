import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { SearchDialog } from "../components/SearchDialog";
import { NewPostModal } from "../components/NewPostModal";
import { SettingsModal } from "../components/SettingsModal";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useSearchData } from "../hooks/useSearchData";
import type { ReactNode } from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

// State type for our layout reducer
interface LayoutState {
  isSearchOpen: boolean;
  isNewPostOpen: boolean;
  isSettingsOpen: boolean;
  searchQuery: string;
}

// Action types
type LayoutAction =
  | { type: "OPEN_SEARCH" }
  | { type: "CLOSE_SEARCH" }
  | { type: "OPEN_NEW_POST" }
  | { type: "CLOSE_NEW_POST" }
  | { type: "OPEN_SETTINGS" }
  | { type: "CLOSE_SETTINGS" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "RESET_SEARCH" };

const initialState: LayoutState = {
  isSearchOpen: false,
  isNewPostOpen: false,
  isSettingsOpen: false,
  searchQuery: "",
};

const layoutReducer = (
  state: LayoutState,
  action: LayoutAction
): LayoutState => {
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

export const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = true,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [
    { isNewPostOpen, isSearchOpen, isSettingsOpen, searchQuery },
    dispatch,
  ] = useReducer(layoutReducer, initialState);

  // Search data and logic
  const {
    isCheckingAuth,
    authError,
    searchResults,
    isSearching,
    searchError,
    onAuthRedirect,
  } = useSearchData(searchQuery);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.layoutContainer}>
      <AppHeader
        onSearchClick={() => dispatch({ type: "OPEN_SEARCH" })}
        onNewPostClick={() => dispatch({ type: "OPEN_NEW_POST" })}
        onSettingsClick={() => dispatch({ type: "OPEN_SETTINGS" })}
        onProfileClick={handleProfileClick}
        onHomeClick={handleHomeClick}
      />

      <div className={styles.layoutContent}>
        <main className={styles.mainContent}>{children}</main>

        {showSidebar && (
          <Sidebar
            onQuickAction={(action) => {
              if (action === "share-music") {
                dispatch({ type: "OPEN_NEW_POST" });
              }
            }}
            onTrendingClick={(id) => {
              console.log("Trending clicked:", id);
            }}
            onFriendClick={(id) => {
              console.log("Friend clicked:", id);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <SearchDialog
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        onClose={() => dispatch({ type: "CLOSE_SEARCH" })}
        onSearchQueryChange={(query: string) =>
          dispatch({ type: "SET_SEARCH_QUERY", payload: query })
        }
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
        onConnectSpotify={() => {
          console.log("Connect Spotify clicked");
        }}
        onConnectAppleMusic={() => {
          console.log("Connect Apple Music clicked");
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => dispatch({ type: "CLOSE_SETTINGS" })}
        onSettingsChange={(settings) => {
          console.log("Settings updated:", settings);
        }}
      />
    </div>
  );
};
