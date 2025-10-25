export interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSpotify?: () => void;
  onConnectAppleMusic?: () => void;
}

export type PlatformType = "spotify" | "apple-music";
