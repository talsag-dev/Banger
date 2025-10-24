import React from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import {
  MessageCircle,
  Share2,
  ExternalLink,
  Music,
  MoreHorizontal,
} from "lucide-react";
import { clsx } from "clsx";
import {
  REACTION_MAP,
  AVAILABLE_REACTIONS,
  getReactionEmoji,
} from "../../utils/reactions";
import type { MusicPostCardProps } from "./types";
import { initialState, musicPostCardReducer } from "./reducer";
import { formatDuration, getTimeAgo } from "./utils";
import "./MusicPostCard.css";
import { CommentsDialog } from "../CommentsDialog";
import { PlatformIcon } from "../PlatformIcon";

export const MusicPostCard: React.FC<MusicPostCardProps> = ({
  post,
  onReaction,
  onComment,
}) => {
  const [{ isCommentsOpen }, dispatch] = React.useReducer(
    musicPostCardReducer,
    initialState
  );

  const {
    userId,
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
    <div className="music-post-card">
      <div className="post-header">
        <div className="user-info">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
            alt="User avatar"
            className="user-avatar"
          />
          <div>
            <h4 className="username">@{userId}</h4>
            <span className="timestamp">{getTimeAgo(timestamp)}</span>
          </div>
        </div>
        {isCurrentlyListening && (
          <div className="currently-listening">
            <Music className="pulse-icon" size={16} />
            <span>Currently listening</span>
          </div>
        )}
      </div>

      <div className="track-info">
        <img
          src={track.albumCover}
          alt={`${track.album} cover`}
          className="album-cover"
        />
        <div className="track-details">
          <h3 className="track-title">{track.title}</h3>
          <p className="track-artist">{track.artist}</p>
          <p className="track-album">{track.album}</p>
          <div className="track-meta">
            <span className="duration">{formatDuration(track.duration)}</span>
            <PlatformIcon
              platform={track.platform}
              size={16}
              title={track.platform}
            />
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              <ExternalLink size={14} />
              Listen
            </a>
          </div>
        </div>
      </div>

      {feeling && <div className="post-feeling">{feeling}</div>}

      {caption && <div className="post-caption">{caption}</div>}

      <div className="post-actions">
        {/* Reactions Menu using Headless UI */}
        <Menu as="div" className="relative">
          <MenuButton className="reactions-menu-btn">
            <span className="reaction-trigger">
              {reactions.length > 0
                ? getReactionEmoji(reactions[0].type)
                : "❤️"}
            </span>
            {reactions.length > 0 && (
              <span className="reaction-count">{reactions.length}</span>
            )}
          </MenuButton>
          <MenuItems className="reactions-menu">
            {AVAILABLE_REACTIONS.map((reactionType) => (
              <MenuItem key={reactionType}>
                {({ focus }) => (
                  <button
                    onClick={() => onReaction(id, reactionType)}
                    className={clsx(
                      "reaction-menu-item",
                      focus && "reaction-menu-item-active"
                    )}
                  >
                    {REACTION_MAP[reactionType]}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => dispatch({ type: "OPEN_COMMENTS" })}
          >
            <MessageCircle size={18} />
            {comments.length > 0 && (
              <span className="count">{comments.length}</span>
            )}
          </button>

          {/* Share Menu using Headless UI */}
          <Menu as="div" className="relative share-menu-container">
            <MenuButton className="action-btn">
              <Share2 size={18} />
              <MoreHorizontal size={14} />
            </MenuButton>
            <MenuItems className="share-menu">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "share-menu-item",
                      focus && "share-menu-item-active"
                    )}
                  >
                    Copy Link
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "share-menu-item",
                      focus && "share-menu-item-active"
                    )}
                  >
                    Share to Twitter
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "share-menu-item",
                      focus && "share-menu-item-active"
                    )}
                  >
                    Share to Instagram
                  </button>
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
    </div>
  );
};
