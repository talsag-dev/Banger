import type { MusicPost } from "../../types/music";

export interface MusicPostCardProps {
  post: MusicPost;
  onLike?: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onEdit?: (post: MusicPost) => void;
  onDelete?: (postId: string) => void;
}

export interface MusicPostCardState {
  isCommentsOpen: boolean;
}

export type MusicPostCardAction =
  | { type: "OPEN_COMMENTS" }
  | { type: "CLOSE_COMMENTS" };
