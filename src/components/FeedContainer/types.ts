import type { Feed, MusicPost } from "../../types/music";

export interface FeedContainerProps {
  feed?: Feed;
  isLoading: boolean;
  error?: Error | null;
  onReaction: (postId: string, type: string) => void;
  onComment: (postId: string, content: string) => void;
  onDiscoverPeople?: () => void;
  onEdit?: (post: MusicPost) => void;
  onDelete?: (postId: string) => void;
}

export interface EmptyFeedProps {
  onDiscoverPeople?: () => void;
}

export interface FeedContentProps {
  posts: MusicPost[];
  onReaction: (postId: string, type: string) => void;
  onComment: (postId: string, content: string) => void;
  onEdit?: (post: MusicPost) => void;
  onDelete?: (postId: string) => void;
}
