export interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (postId: string) => Promise<void>;
  postId: string | null;
  isDeleting?: boolean;
}

