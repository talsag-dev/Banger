import type { MusicPost } from "../../types/music";

export interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
  onPostUpdated?: () => void;
  post?: MusicPost | null; // If provided, modal will be in edit mode
}
