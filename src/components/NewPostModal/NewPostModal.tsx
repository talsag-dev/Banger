import React from "react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import type { NewPostModalProps } from "./types";
import { handlePlatformConnection } from "./utils";
import styles from "./NewPostModal.module.css";

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onConnectSpotify,
  onConnectAppleMusic,
}) => {
  const handleSpotifyConnect = async () => {
    try {
      await handlePlatformConnection("spotify");
      onConnectSpotify?.();
    } catch {
      // Handle error state - could show toast notification
    }
  };

  const handleAppleMusicConnect = async () => {
    try {
      await handlePlatformConnection("apple-music");
      onConnectAppleMusic?.();
    } catch {
      // Handle error state - could show toast notification
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share What You're Listening To"
      size="md"
    >
      <p>
        Connect your music platforms to share what you're currently listening
        to!
      </p>
      <div className={styles.platformButtons}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          className={styles.platformBtnSpotify}
          onClick={handleSpotifyConnect}
        >
          Connect Spotify
        </Button>
        <Button
          variant="primary"
          size="md"
          fullWidth
          className={styles.platformBtnApple}
          onClick={handleAppleMusicConnect}
        >
          Connect Apple Music
        </Button>
      </div>
    </Modal>
  );
};
