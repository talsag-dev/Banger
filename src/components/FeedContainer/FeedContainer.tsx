import React from "react";
import { MusicPostCard } from "../MusicPostCard";
import { Button } from "../Button";
import { Text } from "../Text";
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
      <Text variant="title" align="center">
        Your feed is quiet
      </Text>
      <Text variant="body" color="secondary" align="center">
        Connect with friends or follow some music lovers to see their posts
        here!
      </Text>
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
    <Text variant="body" color="secondary">
      {getLoadingMessage()}
    </Text>
  </div>
);

const ErrorState: React.FC<{ error?: Error | null }> = ({ error }) => (
  <div className={styles.error}>
    <Text variant="body" color="error">
      {getErrorMessage(error)}
    </Text>
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
        <Text variant="subheadline" as="h2">
          Your Music Feed
        </Text>
        <Text variant="body" color="secondary">
          See what your friends are listening to and feeling
        </Text>
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
