import { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Music, Heart, Edit3 } from "lucide-react";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { MusicPostCard } from "../components/MusicPostCard";
import type { MusicPost, UserProfile } from "../types/music";
import { mockPosts } from "../data/mockData";
import styles from "./Profile.module.css";

// State type for our profile reducer
interface ProfileState {
  userProfile: UserProfile | null;
  userPosts: MusicPost[];
  isLoading: boolean;
  activeTab: "posts" | "liked" | "playlists";
}

// Action types
type ProfileAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PROFILE"; payload: UserProfile }
  | { type: "SET_POSTS"; payload: MusicPost[] }
  | { type: "SET_ACTIVE_TAB"; payload: "posts" | "liked" | "playlists" }
  | { type: "TOGGLE_FOLLOW" };

const initialState: ProfileState = {
  userProfile: null,
  userPosts: [],
  isLoading: true,
  activeTab: "posts",
};

const profileReducer = (
  state: ProfileState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PROFILE":
      return { ...state, userProfile: action.payload };
    case "SET_POSTS":
      return { ...state, userPosts: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "TOGGLE_FOLLOW":
      if (!state.userProfile) return state;
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          isFollowing: !state.userProfile.isFollowing,
          followersCount: state.userProfile.isFollowing
            ? state.userProfile.followersCount - 1
            : state.userProfile.followersCount + 1,
        },
      };
    default:
      return state;
  }
};

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [{ userProfile, userPosts, isLoading, activeTab }, dispatch] =
    useReducer(profileReducer, initialState);

  const isOwnProfile = !userId;

  useEffect(() => {
    // Simulate loading user profile and posts
    const loadProfile = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock user profile data
      const profile: UserProfile = {
        id: userId || "current-user",
        username: userId ? "john_doe" : "you",
        displayName: userId ? "John Doe" : "Your Name",
        bio: userId
          ? "Music lover 🎵 | Discovering new sounds daily"
          : "Share your musical journey",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        followersCount: 1250,
        followingCount: 380,
        postsCount: 42,
        isFollowing: userId ? false : undefined, // undefined for own profile
        spotifyConnected: true,
        appleConnected: false,
        joinedDate: "2024-01-15",
        connectedPlatforms: [
          { type: "spotify", isConnected: true, showCurrentlyListening: true },
        ],
        settings: {
          showCurrentlyListening: true,
          allowReactions: true,
          allowComments: true,
          profileVisibility: "public",
        },
      };

      // Mock user posts - filter by userId in real implementation
      const posts = mockPosts.filter(
        (_: MusicPost, index: number) => index < 5
      ); // Show first 5 posts

      dispatch({ type: "SET_PROFILE", payload: profile });
      dispatch({ type: "SET_POSTS", payload: posts });
      dispatch({ type: "SET_LOADING", payload: false });
    };

    loadProfile();
  }, [userId]);

  const handleFollowToggle = () => {
    if (!userProfile || isOwnProfile) return;
    dispatch({ type: "TOGGLE_FOLLOW" });
  };

  const handleReaction = (postId: string, reaction: string) => {
    console.log("Adding reaction:", reaction, "to post:", postId);
  };

  const handleComment = (postId: string, comment: string) => {
    console.log("Adding comment:", comment, "to post:", postId);
  };

  const renderProfileHeader = () => {
    if (!userProfile) return null;

    return (
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <img
              src={userProfile.avatar}
              alt={userProfile.displayName}
              className={styles.avatar}
            />
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.profileName}>
              <Text variant="headline" weight="bold">
                {userProfile.displayName}
              </Text>
              <Text color="muted">@{userProfile.username}</Text>
            </div>

            <Text className={styles.bio}>{userProfile.bio}</Text>

            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <Text weight="bold">{userProfile.postsCount}</Text>
                <Text color="muted" size="sm">
                  Posts
                </Text>
              </div>
              <div className={styles.stat}>
                <Text weight="bold">
                  {userProfile.followersCount.toLocaleString()}
                </Text>
                <Text color="muted" size="sm">
                  Followers
                </Text>
              </div>
              <div className={styles.stat}>
                <Text weight="bold">{userProfile.followingCount}</Text>
                <Text color="muted" size="sm">
                  Following
                </Text>
              </div>
            </div>

            <div className={styles.connectedServices}>
              {userProfile.spotifyConnected && (
                <div className={styles.serviceTag}>
                  <Music size={16} />
                  <Text size="sm">Spotify</Text>
                </div>
              )}
              {userProfile.appleConnected && (
                <div className={styles.serviceTag}>
                  <Music size={16} />
                  <Text size="sm">Apple Music</Text>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.profileActions}>
          {!isOwnProfile && (
            <Button
              variant={userProfile.isFollowing ? "secondary" : "primary"}
              onClick={handleFollowToggle}
            >
              {userProfile.isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderTabs = () => (
    <div className={styles.profileTabs}>
      <button
        className={`${styles.tab} ${
          activeTab === "posts" ? styles.activeTab : ""
        }`}
        onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "posts" })}
      >
        <Music size={16} />
        Posts
      </button>
      <button
        className={`${styles.tab} ${
          activeTab === "liked" ? styles.activeTab : ""
        }`}
        onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "liked" })}
      >
        <Heart size={16} />
        Liked
      </button>
      <button
        className={`${styles.tab} ${
          activeTab === "playlists" ? styles.activeTab : ""
        }`}
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_TAB", payload: "playlists" })
        }
      >
        <Music size={16} />
        Playlists
      </button>
    </div>
  );

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingState}>
          <Text color="muted">Loading...</Text>
        </div>
      );
    }

    switch (activeTab) {
      case "posts":
        return (
          <div className={styles.postsGrid}>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <MusicPostCard
                  key={post.id}
                  post={post}
                  onReaction={handleReaction}
                  onComment={handleComment}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <Music size={48} className="text-gray-400" />
                <Text color="muted">No posts yet</Text>
                {isOwnProfile && (
                  <Text color="muted" size="sm">
                    Start sharing your musical discoveries!
                  </Text>
                )}
              </div>
            )}
          </div>
        );

      case "liked":
        return (
          <div className={styles.emptyState}>
            <Heart size={48} className="text-gray-400" />
            <Text color="muted">No liked posts yet</Text>
          </div>
        );

      case "playlists":
        return (
          <div className={styles.emptyState}>
            <Music size={48} className="text-gray-400" />
            <Text color="muted">No playlists yet</Text>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && !userProfile) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingState}>
          <User size={48} className="text-gray-400" />
          <Text color="muted">Loading profile...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {renderProfileHeader()}
      {renderTabs()}
      {renderTabContent()}
    </div>
  );
};
