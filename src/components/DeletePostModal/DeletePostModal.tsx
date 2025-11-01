import { Modal } from "../Modal";
import { Button } from "../Button";
import { Text } from "../Text";
import { Trash2, Loader2 } from "lucide-react";
import type { DeletePostModalProps } from "./types";

export const DeletePostModal: React.FC<DeletePostModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  postId,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    if (!postId) return;
    await onConfirm(postId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Post"
      size="sm"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <Text variant="body" as="div">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </Text>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleConfirm}
            disabled={isDeleting || !postId}
            leftIcon={
              isDeleting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )
            }
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

