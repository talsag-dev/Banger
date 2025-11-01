import { useReducer } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import {
  MessageCircle,
  Share2,
  ExternalLink,
  Music,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { clsx } from "clsx";
import { Button } from "../Button";
import { Card } from "../Card";
import {
  REACTION_MAP,
  AVAILABLE_REACTIONS,
  getReactionEmoji,
} from "../../utils/reactions";
import type { MusicPostCardProps } from "./types";
import { initialState, musicPostCardReducer } from "./reducer";
import { formatDuration, getTimeAgo } from "./utils";
import styles from "./MusicPostCard.module.css";
import { CommentsDialog } from "../CommentsDialog";
import { PlatformIcon } from "../PlatformIcon";
import { useAuth } from "../../hooks/useAuth";

export const MusicPostCard: React.FC<MusicPostCardProps> = ({
  post,
  onReaction,
  onComment,
  onEdit,
  onDelete,
}) => {
  const [{ isCommentsOpen }, dispatch] = useReducer(
    musicPostCardReducer,
    initialState
  );
  const { user } = useAuth();
  const isOwnPost = user?.id && post.userId;

  const {
    userId,
    username,
    timestamp,
    track,
    feeling,
    caption,
    reactions,
    isCurrentlyListening,
    comments,
    id,
  } = post;

  return (
    <Card variant="noImage" className={styles.musicPostCard}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
            alt="User avatar"
            className={styles.userAvatar}
          />
          <div>
            <h4 className={styles.username}>@{username || userId}</h4>
            <span className={styles.timestamp}>{getTimeAgo(timestamp)}</span>
          </div>
        </div>
        <div className={styles.postHeaderActions}>
          {isCurrentlyListening && (
            <div className={styles.currentlyListening}>
              <Music className={styles.pulseIcon} size={16} />
              <span>Currently listening</span>
            </div>
          )}
          {isOwnPost && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(post)}
                className={styles.editPostButton}
                leftIcon={<Edit size={16} />}
                aria-label="Edit post"
                type="button"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(post.id)}
                className={styles.deletePostButton}
                leftIcon={<Trash2 size={16} />}
                aria-label="Delete post"
                type="button"
              />
            </>
          )}
        </div>
      </div>

      <div className={styles.trackInfo}>
        <img
          src={track.albumCover}
          alt={`${track.album} cover`}
          className={styles.albumCover}
        />
        <div className={styles.trackDetails}>
          <h3 className={styles.trackTitle}>{track.title}</h3>
          <p className={styles.trackArtist}>{track.artist}</p>
          <p className={styles.trackAlbum}>{track.album}</p>
          <div className={styles.trackMeta}>
            <span className={styles.duration}>
              {formatDuration(track.duration)}
            </span>
            <PlatformIcon
              platform={track.platform}
              size={16}
              title={track.platform}
            />
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              <ExternalLink size={14} />
              Listen
            </a>
          </div>
        </div>
      </div>

      {feeling && <div className={styles.postFeeling}>{feeling}</div>}

      {caption && <div className={styles.postCaption}>{caption}</div>}

      <div className={styles.postActions}>
        {/* Reactions Menu using Headless UI */}
        <Menu as="div" className={styles.relative}>
          <MenuButton className={styles.reactionsMenuBtn}>
            <span className={styles.reactionTrigger}>
              {reactions.length > 0
                ? getReactionEmoji(reactions[0].type)
                : "❤️"}
            </span>
            {reactions.length > 0 && (
              <span className={styles.reactionCount}>{reactions.length}</span>
            )}
          </MenuButton>
          <MenuItems className={styles.reactionsMenu}>
            {AVAILABLE_REACTIONS.map((reactionType) => (
              <MenuItem key={reactionType}>
                {({ focus }) => (
                  <Button
                    onClick={() => onReaction(id, reactionType)}
                    variant="ghost"
                    size="sm"
                    className={clsx(
                      styles.reactionMenuItem,
                      focus && styles.reactionMenuItemActive
                    )}
                  >
                    {REACTION_MAP[reactionType]}
                  </Button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        <div className={styles.actionButtons}>
          <Button
            variant="ghost"
            size="sm"
            className={styles.actionBtn}
            onClick={() => dispatch({ type: "OPEN_COMMENTS" })}
            leftIcon={<MessageCircle size={18} />}
          >
            {comments.length > 0 && (
              <span className={styles.count}>{comments.length}</span>
            )}
          </Button>

          {/* Actions Menu - Share for all, Edit/Delete for own posts */}
          <Menu
            as="div"
            className={`${styles.relative} ${styles.shareMenuContainer}`}
          >
            <MenuButton className={styles.actionBtn}>
              <Share2 size={18} />
              <MoreHorizontal size={14} />
            </MenuButton>
            <MenuItems className={styles.shareMenu}>
              <MenuItem>
                {({ focus }) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className={clsx(
                      styles.shareMenuItem,
                      focus && styles.shareMenuItemActive
                    )}
                  >
                    Copy Link
                  </Button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className={clsx(
                      styles.shareMenuItem,
                      focus && styles.shareMenuItemActive
                    )}
                  >
                    Share to Twitter
                  </Button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className={clsx(
                      styles.shareMenuItem,
                      focus && styles.shareMenuItemActive
                    )}
                  >
                    Share to Instagram
                  </Button>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>

      <CommentsDialog
        isOpen={isCommentsOpen}
        onClose={() => dispatch({ type: "CLOSE_COMMENTS" })}
        postId={id}
        onComment={onComment}
      />
    </Card>
  );
};
