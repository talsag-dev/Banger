import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { Comment } from "../../types/music";
import type { CommentsDialogProps } from "./types";

export const CommentsDialog: React.FC<CommentsDialogProps> = ({
  isOpen,
  onClose,
  postId,
  onComment,
}) => {
  const [commentText, setCommentText] = React.useState("");
  const [showSkeleton, setShowSkeleton] = React.useState(false);

  const queryClient = useQueryClient();

  // Handle skeleton timing to prevent immediate flicker
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 100); // Small delay to prevent immediate skeleton flash
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [isOpen]);

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async (): Promise<Comment[]> => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
    enabled: isOpen,
    staleTime: 30000,
  });

  const postCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to post comment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentText("");
      onComment(postId, commentText);
    },
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      postCommentMutation.mutate(commentText);
    }
  };

  // Skeleton component for loading comments
  const CommentSkeleton = () => (
    <div className="skeleton-comments">
      {[1, 2, 3].map((index) => (
        <div key={index} className="skeleton-comment">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-content">
            <div className="skeleton-username"></div>
            <div
              className={`skeleton-text ${
                index === 1 ? "long" : index === 2 ? "medium" : "short"
              }`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative" transition>
      <DialogBackdrop className="dialog-overlay" transition />

      <div className="dialog-container">
        <div className="dialog-content">
          <DialogPanel className="dialog-panel" transition>
            <DialogTitle className="dialog-title">
              Comments
              <button onClick={onClose} className="dialog-close-btn">
                <X size={20} />
              </button>
            </DialogTitle>

            <div className="comments-container">
              {commentsLoading && showSkeleton ? (
                <CommentSkeleton />
              ) : comments.length > 0 ? (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <img
                        src={comment.avatar}
                        alt={`${comment.username} avatar`}
                        className="comment-avatar"
                      />
                      <div className="comment-content">
                        <span className="comment-username">
                          @{comment.username}
                        </span>
                        <p className="comment-text">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-comments">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <form onSubmit={handleComment} className="comment-form">
              <div className="comment-form-container">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="comment-input"
                />
                <button
                  type="submit"
                  disabled={postCommentMutation.isPending}
                  className="comment-submit"
                >
                  {postCommentMutation.isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
