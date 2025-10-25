import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "../Button";
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
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className={styles.modalDialog}>
        <TransitionChild
          enter={styles.newpostBackdropEnter}
          enterFrom={styles.newpostBackdropEnterFrom}
          enterTo={styles.newpostBackdropEnterTo}
          leave={styles.newpostBackdropLeave}
          leaveFrom={styles.newpostBackdropLeaveFrom}
          leaveTo={styles.newpostBackdropLeaveTo}
        >
          <div className={styles.modalBackdrop} />
        </TransitionChild>

        <div className={styles.modalContainer}>
          <TransitionChild
            enter={styles.newpostPanelEnter}
            enterFrom={styles.newpostPanelEnterFrom}
            enterTo={styles.newpostPanelEnterTo}
            leave={styles.newpostPanelLeave}
            leaveFrom={styles.newpostPanelLeaveFrom}
            leaveTo={styles.newpostPanelLeaveTo}
          >
            <DialogPanel className={styles.modalPanel}>
              <div className={styles.modalHeader}>
                <DialogTitle className={styles.modalTitle}>
                  Share What You're Listening To
                </DialogTitle>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  leftIcon={<X size={20} />}
                  className={styles.modalClose}
                />
              </div>
              <div className={styles.modalContent}>
                <p>
                  Connect your music platforms to share what you're currently
                  listening to!
                </p>
                <div className={styles.platformButtons}>
                  <Button
                    size="md"
                    fullWidth
                    className={styles.platformBtnSpotify}
                    onClick={handleSpotifyConnect}
                  >
                    Connect Spotify
                  </Button>
                  <Button
                    size="md"
                    fullWidth
                    className={styles.platformBtnApple}
                    onClick={handleAppleMusicConnect}
                  >
                    Connect Apple Music
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
