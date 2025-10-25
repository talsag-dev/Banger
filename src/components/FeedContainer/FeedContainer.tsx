import React from "react";
import { MusicPostCard } from "../MusicPostCard";
import { Button } from "../Button";
import type {
  FeedContainerProps,
  EmptyFeedProps,
  FeedContentProps,
} from "./types";
import {
  getLoadingMessage,
  getErrorMessage,
  handleDiscoverPeople,
} from "./utils";
import styles from "./FeedContainer.module.css";

const EmptyFeed: React.FC<EmptyFeedProps> = ({ onDiscoverPeople }) => {
  const handleDiscoverClick = async () => {
    try {
      await handleDiscoverPeople();
      onDiscoverPeople?.();
    } catch {
      // Handle error state - could show toast notification
    }
  };

  return (
    <div className={styles.emptyFeed}>
      <div className={styles.emptyIcon}>🎵</div>
      <h3>Your feed is quiet</h3>
      <p>
        Connect with friends or follow some music lovers to see their posts
        here!
      </p>
      <Button 
        variant="primary" 
        size="md"
        className={styles.ctaButton} 
        onClick={handleDiscoverClick}
      >
        Discover People
      </Button>
    </div>
  );
};

const FeedContent: React.FC<FeedContentProps> = ({
  posts,
  onReaction,
  onComment,
}) => (
  <div className={styles.postsList}>
    {posts.map((post) => (
      <MusicPostCard
        key={post.id}
        post={post}
        onReaction={onReaction}
        onComment={onComment}
      />
    ))}
  </div>
);

const LoadingState: React.FC = () => (
  <div className={styles.loading}>
    <div className={styles.loadingSpinner}></div>
    <p>{getLoadingMessage()}</p>
  </div>
);

const ErrorState: React.FC<{ error?: Error | null }> = ({ error }) => (
  <div className={styles.error}>
    <p>{getErrorMessage(error)}</p>
  </div>
);

export const FeedContainer: React.FC<FeedContainerProps> = ({
  feed,
  isLoading,
  error,
  onReaction,
  onComment,
  onDiscoverPeople,
}) => {
  if (isLoading) {
    return (
      <div className={styles.feedContainer}>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feedContainer}>
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <div className={styles.feedHeader}>
        <h2>Your Music Feed</h2>
        <p>See what your friends are listening to and feeling</p>
      </div>

      {feed?.posts.length === 0 ? (
        <EmptyFeed onDiscoverPeople={onDiscoverPeople} />
      ) : (
        feed && (
          <FeedContent
            posts={feed.posts}
            onReaction={onReaction}
            onComment={onComment}
          />
        )
      )}
    </div>
  );
};
