import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, Combobox, Transition } from "@headlessui/react";
import { Search, Plus, Settings, X } from "lucide-react";
import { MusicPostCard } from "../components/MusicPostCard";
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
  ] = React.useReducer(homeReducer, initialState);

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

  if (isLoading) {
    return (
      <div className="home-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your music feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">
          <p>Failed to load feed. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Banger</h1>
          <div className="header-actions">
            <button
              onClick={() => dispatch({ type: "OPEN_SEARCH" })}
              className="search-container"
            >
              <Search size={20} className="search-icon" />
              <span className="search-placeholder">
                Search music, friends, or feelings...
              </span>
            </button>
            <button
              onClick={() => dispatch({ type: "OPEN_NEW_POST" })}
              className="header-btn"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => dispatch({ type: "OPEN_SETTINGS" })}
              className="header-btn"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Search Command Palette */}
      <Transition show={isSearchOpen} as={React.Fragment}>
        <Dialog
          onClose={() => dispatch({ type: "CLOSE_SEARCH" })}
          className="search-dialog"
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="search-backdrop" />
          </Transition.Child>

          <div className="search-dialog-container">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="search-panel">
                <Combobox
                  value={searchQuery}
                  onChange={(value) =>
                    dispatch({ type: "SET_SEARCH_QUERY", payload: value || "" })
                  }
                >
                  <div className="search-input-container">
                    <Search size={20} className="search-input-icon" />
                    <Combobox.Input
                      className="search-combobox-input"
                      placeholder="Search for music, artists, friends..."
                      onChange={(event) =>
                        dispatch({
                          type: "SET_SEARCH_QUERY",
                          payload: event.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => dispatch({ type: "CLOSE_SEARCH" })}
                      className="search-close-btn"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <Combobox.Options className="search-results">
                    <div className="search-section">
                      <h4>Recent Searches</h4>
                      <Combobox.Option
                        value="Taylor Swift"
                        className="search-option"
                      >
                        🎵 Taylor Swift
                      </Combobox.Option>
                      <Combobox.Option
                        value="Chill vibes"
                        className="search-option"
                      >
                        💭 Chill vibes
                      </Combobox.Option>
                    </div>
                    <div className="search-section">
                      <h4>Trending</h4>
                      <Combobox.Option
                        value="Bad Habit"
                        className="search-option"
                      >
                        🔥 Bad Habit - Steve Lacy
                      </Combobox.Option>
                      <Combobox.Option
                        value="As It Was"
                        className="search-option"
                      >
                        🎶 As It Was - Harry Styles
                      </Combobox.Option>
                    </div>
                  </Combobox.Options>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* New Post Modal */}
      <Transition show={isNewPostOpen} as={React.Fragment}>
        <Dialog
          onClose={() => dispatch({ type: "CLOSE_NEW_POST" })}
          className="modal-dialog"
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="modal-backdrop" />
          </Transition.Child>

          <div className="modal-container">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-panel">
                <div className="modal-header">
                  <Dialog.Title className="modal-title">
                    Share What You're Listening To
                  </Dialog.Title>
                  <button
                    onClick={() => dispatch({ type: "CLOSE_NEW_POST" })}
                    className="modal-close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-content">
                  <p>
                    Connect your music platforms to share what you're currently
                    listening to!
                  </p>
                  <div className="platform-buttons">
                    <button className="platform-btn spotify">
                      Connect Spotify
                    </button>
                    <button className="platform-btn apple">
                      Connect Apple Music
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Settings Modal */}
      <Transition show={isSettingsOpen} as={React.Fragment}>
        <Dialog
          onClose={() => dispatch({ type: "CLOSE_SETTINGS" })}
          className="modal-dialog"
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="modal-backdrop" />
          </Transition.Child>

          <div className="modal-container">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-panel">
                <div className="modal-header">
                  <Dialog.Title className="modal-title">Settings</Dialog.Title>
                  <button
                    onClick={() => dispatch({ type: "CLOSE_SETTINGS" })}
                    className="modal-close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-content">
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Show what I'm currently listening to
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Allow reactions on my posts
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Allow comments on my posts
                    </label>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <main className="main-content">
        <div className="feed-container">
          <div className="feed-header">
            <h2>Your Music Feed</h2>
            <p>See what your friends are listening to and feeling</p>
          </div>

          {feed?.posts.length === 0 ? (
            <div className="empty-feed">
              <div className="empty-icon">🎵</div>
              <h3>Your feed is quiet</h3>
              <p>
                Connect with friends or follow some music lovers to see their
                posts here!
              </p>
              <button className="cta-button">Discover People</button>
            </div>
          ) : (
            <div className="posts-list">
              {feed?.posts.map((post) => (
                <MusicPostCard
                  key={post.id}
                  post={post}
                  onReaction={handleReaction}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Trending Now</h3>
            <div className="trending-list">
              <div className="trending-item">
                <span className="trending-emoji">🔥</span>
                <span>Pop music is having a moment</span>
              </div>
              <div className="trending-item">
                <span className="trending-emoji">🎸</span>
                <span>Rock revival playlist</span>
              </div>
              <div className="trending-item">
                <span className="trending-emoji">💎</span>
                <span>Hidden gems of 2024</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn spotify">
                Connect Spotify
              </button>
              <button className="quick-action-btn apple">
                Connect Apple Music
              </button>
              <button className="quick-action-btn share">
                Share What You're Listening To
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Active Friends</h3>
            <div className="active-friends">
              <div className="friend-item">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=friend1"
                  alt="Friend"
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <span className="friend-name">Alex</span>
                  <span className="friend-status">🎵 Listening to Jazz</span>
                </div>
              </div>
              <div className="friend-item">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=friend2"
                  alt="Friend"
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <span className="friend-name">Sarah</span>
                  <span className="friend-status">💭 Feeling nostalgic</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
