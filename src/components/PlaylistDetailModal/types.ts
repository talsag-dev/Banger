import type { Playlist } from "@types";

export interface PlaylistDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist | null;
  userId: string | undefined;
}
