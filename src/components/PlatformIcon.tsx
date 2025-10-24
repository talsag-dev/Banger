import React from "react";
import { Music } from "lucide-react";

// Import SVG files
import SpotifyIcon from "../assets/spotify-color-svgrepo-com.svg";
import AppleMusicIcon from "../assets/apple-music-svgrepo-com.svg";
import SoundCloudIcon from "../assets/soundcloud-color-svgrepo-com.svg";
import YouTubeMusicIcon from "../assets/youtube-music-song-multimedia-audio-svgrepo-com.svg";

interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
  title?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 16,
  className = "",
  title,
}) => {
  const iconStyle = {
    width: size,
    height: size,
  };

  switch (platform) {
    case "spotify":
      return (
        <img
          src={SpotifyIcon}
          alt="Spotify"
          title={title || "Spotify"}
          style={iconStyle}
          className={className}
        />
      );
    case "apple-music":
      return (
        <img
          src={AppleMusicIcon}
          alt="Apple Music"
          title={title || "Apple Music"}
          style={iconStyle}
          className={className}
        />
      );
    case "soundcloud":
      return (
        <img
          src={SoundCloudIcon}
          alt="SoundCloud"
          title={title || "SoundCloud"}
          style={iconStyle}
          className={className}
        />
      );
    case "youtube-music":
      return (
        <img
          src={YouTubeMusicIcon}
          alt="YouTube Music"
          title={title || "YouTube Music"}
          style={iconStyle}
          className={className}
        />
      );
    default:
      return (
        <div title={title}>
          <Music size={size} className={className} />
        </div>
      );
  }
};
