import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "../Button";
import type { Comment } from "../../types/music";
import type { CommentsDialogProps } from "./types";
import styles from "./CommentsDialog.module.css";

export const CommentsDialog: React.FC<CommentsDialogProps> = ({
  isOpen,
  onClose,
  postId,
  onComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);

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
    <div className={styles.skeletonComments}>
      {[1, 2, 3].map((index) => (
        <div key={index} className={styles.skeletonComment}>
          <div className={styles.skeletonAvatar}></div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonUsername}></div>
            <div
              className={`${styles.skeletonText} ${
                index === 1
                  ? styles.long
                  : index === 2
                  ? styles.medium
                  : styles.short
              }`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative" transition>
      <DialogBackdrop className={styles.dialogOverlay} transition />

      <div className={styles.dialogContainer}>
        <div className={styles.dialogContent}>
          <DialogPanel className={styles.dialogPanel} transition>
            <DialogTitle className={styles.dialogTitle}>
              Comments
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                leftIcon={<X size={20} />}
                className={styles.dialogCloseBtn}
              />
            </DialogTitle>

            <div className={styles.commentsContainer}>
              {commentsLoading && showSkeleton ? (
                <CommentSkeleton />
              ) : comments.length > 0 ? (
                <div className={styles.commentsList}>
                  {comments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <img
                        src={comment.avatar}
                        alt={`${comment.username} avatar`}
                        className={styles.commentAvatar}
                      />
                      <div className={styles.commentContent}>
                        <span className={styles.commentUsername}>
                          @{comment.username}
                        </span>
                        <p className={styles.commentText}>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noComments}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <form onSubmit={handleComment} className={styles.commentForm}>
              <div className={styles.commentFormContainer}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className={styles.commentInput}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={postCommentMutation.isPending}
                  loading={postCommentMutation.isPending}
                  className={styles.commentSubmit}
                >
                  {postCommentMutation.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
