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
import type { MusicPost } from "../types/music";
import { PlatformIcon } from "./PlatformIcon";
import { CommentsDialog } from "./CommentsDialog";

interface MusicPostCardProps {
  post: MusicPost;
  onReaction: (postId: string, type: string) => void;
  onComment: (postId: string, content: string) => void;
}

export const MusicPostCard: React.FC<MusicPostCardProps> = ({
  post,
  onReaction,
  onComment,
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - postTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    return `${diffInHours} hours ago`;
  };

  const reactionEmojis = ["❤️", "🔥", "😍", "🎵", "💯"];

  return (
    <div className="music-post-card">
      <div className="post-header">
        <div className="user-info">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`}
            alt="User avatar"
            className="user-avatar"
          />
          <div>
            <h4 className="username">@{post.userId}</h4>
            <span className="timestamp">{getTimeAgo(post.timestamp)}</span>
          </div>
        </div>
        {post.isCurrentlyListening && (
          <div className="currently-listening">
            <Music className="pulse-icon" size={16} />
            <span>Currently listening</span>
          </div>
        )}
      </div>

      <div className="track-info">
        <img
          src={post.track.albumCover}
          alt={`${post.track.album} cover`}
          className="album-cover"
        />
        <div className="track-details">
          <h3 className="track-title">{post.track.title}</h3>
          <p className="track-artist">{post.track.artist}</p>
          <p className="track-album">{post.track.album}</p>
          <div className="track-meta">
            <span className="duration">
              {formatDuration(post.track.duration)}
            </span>
            <PlatformIcon
              platform={post.track.platform}
              size={16}
              title={post.track.platform}
            />
            <a
              href={post.track.externalUrl}
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

      {post.feeling && <div className="post-feeling">{post.feeling}</div>}

      {post.caption && <div className="post-caption">{post.caption}</div>}

      <div className="post-actions">
        {/* Reactions Menu using Headless UI */}
        <Menu as="div" className="relative">
          <MenuButton className="reactions-menu-btn">
            <span className="reaction-trigger">❤️</span>
            {post.reactions.length > 0 && (
              <span className="reaction-count">{post.reactions.length}</span>
            )}
          </MenuButton>
          <MenuItems className="reactions-menu">
            {reactionEmojis.map((emoji) => (
              <MenuItem key={emoji}>
                {({ focus }) => (
                  <button
                    onClick={() => onReaction(post.id, emoji)}
                    className={clsx(
                      "reaction-menu-item",
                      focus && "reaction-menu-item-active"
                    )}
                  >
                    {emoji}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => setIsCommentsOpen(true)}
          >
            <MessageCircle size={18} />
            {post.comments.length > 0 && (
              <span className="count">{post.comments.length}</span>
            )}
          </button>

          {/* Share Menu using Headless UI */}
          <Menu as="div" className="relative">
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

      {/* Comments Dialog */}
      <CommentsDialog
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        postId={post.id}
        onComment={onComment}
      />
    </div>
  );
};
