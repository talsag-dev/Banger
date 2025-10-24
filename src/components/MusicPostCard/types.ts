import type { MusicPost } from "../../types/music";

export interface MusicPostCardProps {
  post: MusicPost;
  onReaction: (postId: string, type: string) => void;
  onComment: (postId: string, content: string) => void;
}

export interface MusicPostCardState {
  isCommentsOpen: boolean;
}

export type MusicPostCardAction =
  | { type: "OPEN_COMMENTS" }
  | { type: "CLOSE_COMMENTS" };
