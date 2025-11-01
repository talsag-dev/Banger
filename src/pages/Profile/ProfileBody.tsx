import { Music, Heart, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { MusicPostCard } from "@components/MusicPostCard";
import { Card } from "@components/Card";
import { PlatformIcon } from "@components/PlatformIcon";
import { Loading } from "@components/Loading";
import { getPlatformName } from "@utils/platformStyles";
import type { ProfileProps } from "./types";
import styles from "./Profile.module.css";

export const ProfileBody = ({
  userProfile,
  userPosts,
  likedPosts,
  playlists,
  isLoading,
  isLoadingLiked,
  isLoadingPlaylists,
  isOwnProfile,
  activeTab,
  onTabChange,
  onFollowToggle,
  onEditPost,
  onDeletePost,
}: ProfileProps) => {
  const handleFollowToggle = () => {
    onFollowToggle();
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
              {userProfile.isFollowing ? "Unfollow" : "Follow"}
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
        onClick={() => onTabChange("posts")}
      >
        <Music size={16} />
        Posts
      </button>
      <button
        className={`${styles.tab} ${
          activeTab === "liked" ? styles.activeTab : ""
        }`}
        onClick={() => onTabChange("liked")}
      >
        <Heart size={16} />
        Liked
      </button>
      <button
        className={`${styles.tab} ${
          activeTab === "playlists" ? styles.activeTab : ""
        }`}
        onClick={() => onTabChange("playlists")}
      >
        <Music size={16} />
        Playlists
      </button>
    </div>
  );

  const renderTabContent = () => {
    if (isLoading) {
      return <Loading message="Loading..." />;
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
                  onEdit={onEditPost}
                  onDelete={onDeletePost}
                />
              ))
            ) : (
              <div className={styles.empty}>
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
        if (isLoadingLiked) {
          return <Loading message="Loading liked posts..." />;
        }
        return (
          <div className={styles.postsGrid}>
            {likedPosts.length > 0 ? (
              likedPosts.map((post) => (
                <MusicPostCard
                  key={post.id}
                  post={post}
                  onReaction={handleReaction}
                  onComment={handleComment}
                  onEdit={onEditPost}
                  onDelete={onDeletePost}
                />
              ))
            ) : (
              <div className={styles.empty}>
                <Heart size={48} className="text-gray-400" />
                <Text color="muted">No liked posts yet</Text>
                {isOwnProfile && (
                  <Text color="muted" size="sm">
                    Start liking posts to see them here!
                  </Text>
                )}
              </div>
            )}
          </div>
        );

      case "playlists":
        if (isLoadingPlaylists) {
          return <Loading message="Loading playlists..." />;
        }
        return (
          <div className={styles.playlistsGrid}>
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <Card
                  key={playlist.id}
                  image={playlist.image}
                  imageAlt={playlist.name}
                  imagePlaceholder={<Music size={32} />}
                >
                  <Text weight="semibold" size="sm">
                    {playlist.name}
                  </Text>
                  <Text color="muted" size="xs">
                    {playlist.owner} • {playlist.trackCount} tracks
                  </Text>
                  {playlist.description && (
                    <Text
                      color="muted"
                      size="xs"
                      className={styles.playlistDescription}
                    >
                      {playlist.description}
                    </Text>
                  )}
                  {playlist.externalUrl && (
                    <Text
                      as="a"
                      href={playlist.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="caption"
                      className={clsx(styles.playlistLink, {
                        [styles.playlistLinkSpotify]:
                          playlist.provider === "spotify",
                        [styles.playlistLinkAppleMusic]:
                          playlist.provider === "apple-music",
                        [styles.playlistLinkYoutubeMusic]:
                          playlist.provider === "youtube-music",
                        [styles.playlistLinkSoundcloud]:
                          playlist.provider === "soundcloud",
                      })}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                        e.stopPropagation()
                      }
                    >
                      <PlatformIcon platform={playlist.provider} size={16} />
                      <span>Open in {getPlatformName(playlist.provider)}</span>
                      <ExternalLink size={14} />
                    </Text>
                  )}
                </Card>
              ))
            ) : (
              <div className={styles.empty}>
                <Music size={48} className="text-gray-400" />
                <Text color="muted">No playlists yet</Text>
                {isOwnProfile && (
                  <Text color="muted" size="sm">
                    Connect your music services to see your playlists here!
                  </Text>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && !userProfile) {
    return (
      <div className={styles.profileContainer}>
        <Loading message="Loading profile..." />
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
