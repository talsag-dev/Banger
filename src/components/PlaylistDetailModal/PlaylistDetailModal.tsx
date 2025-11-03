import React from "react";
import { ExternalLink, Music } from "lucide-react";
import { Modal } from "../Modal";
import { Loading } from "../Loading";
import { Text } from "../Text";
import { PlatformIcon } from "../PlatformIcon";
import { usePlaylistTracks } from "../../hooks/usePlaylistTracks";
import { getPlatformName } from "../../utils/platformStyles";
import type { PlaylistDetailModalProps } from "./types";
import styles from "./PlaylistDetailModal.module.css";

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({
  isOpen,
  onClose,
  playlist,
  userId,
}) => {
  const { data, isLoading, error } = usePlaylistTracks(
    userId,
    playlist?.id,
    isOpen && !!playlist
  );

  if (!playlist) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className={styles.modal}>
      <div className={styles.playlistHeader}>
        {playlist.image ? (
          <img
            src={playlist.image}
            alt={playlist.name}
            className={styles.playlistImage}
          />
        ) : (
          <div className={styles.playlistImagePlaceholder}>
            <Music size={32} />
          </div>
        )}
        <div className={styles.playlistInfo}>
          <Text variant="headline" as="h2" weight="bold">
            {playlist.name}
          </Text>
          {playlist.description && (
            <Text
              variant="body"
              color="muted"
              className={styles.playlistDescription}
            >
              {playlist.description}
            </Text>
          )}
          <div className={styles.playlistMeta}>
            <Text variant="caption" color="muted">
              {playlist.owner} • {data?.tracks.length || playlist.trackCount}{" "}
              tracks
            </Text>
            <PlatformIcon platform={playlist.provider} size={16} />
          </div>
        </div>
      </div>

      <div className={styles.playlistContent}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Loading message="Loading tracks..." />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <Text color="error">Failed to load tracks</Text>
          </div>
        ) : data?.tracks.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Text color="muted">No tracks in this playlist</Text>
          </div>
        ) : (
          <div className={styles.tracksList}>
            {data?.tracks.map((track, index) => (
              <div key={track.id} className={styles.trackItem}>
                <div className={styles.trackNumber}>{index + 1}</div>
                <div className={styles.trackInfo}>
                  <Text
                    variant="body"
                    weight="medium"
                    className={styles.trackTitle}
                  >
                    {track.title}
                  </Text>
                  <Text
                    variant="caption"
                    color="muted"
                    className={styles.trackArtist}
                  >
                    {track.artist} • {track.album}
                  </Text>
                </div>
                <div className={styles.trackActions}>
                  {track.duration > 0 && (
                    <Text
                      variant="caption"
                      color="muted"
                      className={styles.trackDuration}
                    >
                      {formatDuration(track.duration)}
                    </Text>
                  )}
                  {track.externalUrl && (
                    <a
                      href={track.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.trackLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {playlist.externalUrl && (
        <div className={styles.playlistFooter}>
          <a
            href={playlist.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.playlistExternalLink}
          >
            <PlatformIcon platform={playlist.provider} size={16} />
            <span>Open in {getPlatformName(playlist.provider)}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </Modal>
  );
};
