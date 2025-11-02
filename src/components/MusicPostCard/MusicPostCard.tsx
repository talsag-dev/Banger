import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import {
  MessageCircle,
  Share2,
  ExternalLink,
  Music,
  MoreHorizontal,
  Edit,
  Trash2,
  Heart,
} from "lucide-react";
import { clsx } from "clsx";
import { Button } from "../Button";
import { Card } from "../Card";
import { Text } from "../Text";
import type { MusicPostCardProps } from "./types";
import { initialState, musicPostCardReducer } from "./reducer";
import { formatDuration, getTimeAgo } from "./utils";
import styles from "./MusicPostCard.module.css";
import { CommentsDialog } from "../CommentsDialog";
import { PlatformIcon } from "../PlatformIcon";
import { useAuth } from "../../hooks/useAuth";

export const MusicPostCard: React.FC<MusicPostCardProps> = ({
  post,
  onLike,
  onComment,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [{ isCommentsOpen }, dispatch] = useReducer(
    musicPostCardReducer,
    initialState
  );
  const { user } = useAuth();
  const isOwnPost = user?.id && post.userId;

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${post.userId}`);
  };

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

  // Check if current user has liked this post
  const isLiked = reactions.some((reaction) => reaction.userId === user?.id);

  return (
    <Card variant="noImage" className={styles.musicPostCard}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
            alt="User avatar"
            className={styles.userAvatar}
          />
          <div className={styles.usernameContainer}>
            <Text
              as="button"
              onClick={handleUsernameClick}
              className={styles.username}
              type="button"
            >
              @{username || userId}
            </Text>
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
        {/* Like Button */}
        <button
          onClick={() => onLike?.(id)}
          className={clsx(
            styles.likeButton,
            isLiked && styles.likeButtonActive
          )}
          type="button"
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart
            size={18}
            className={styles.likeIcon}
            fill={isLiked ? "currentColor" : "none"}
          />
          {reactions.length > 0 && (
            <span className={styles.likeCount}>{reactions.length}</span>
          )}
        </button>

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
