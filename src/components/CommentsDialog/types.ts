export interface CommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onComment: (postId: string, content: string) => void;
}
