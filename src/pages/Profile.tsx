import { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Music, Heart } from "lucide-react";
import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { MusicPostCard } from "@components/MusicPostCard";
import type { MusicPost } from "@types";
import { http } from "@utils/http";
import styles from "./Profile.module.css";
import type { UserProfile } from "@types";

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
    const loadProfile = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const profile = await http<UserProfile>(
          `/users/${userId || "current-user"}/profile`
        );
        const postsData = await http<{ posts: MusicPost[] }>(
          `/posts/user/${userId || "current-user"}`
        );
        dispatch({ type: "SET_PROFILE", payload: profile });
        dispatch({ type: "SET_POSTS", payload: postsData.posts || [] });
      } catch {
        dispatch({ type: "SET_POSTS", payload: [] });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
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
