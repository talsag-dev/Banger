export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumCover: string;
  duration: number; // in seconds
  platform: "spotify" | "apple-music" | "youtube-music" | "soundcloud";
  externalUrl: string;
  previewUrl?: string;
}

export interface MusicPost {
  id: string;
  userId: string;
  track: Track;
  feeling?: string;
  caption?: string;
  isCurrentlyListening: boolean;
  timestamp: string;
  reactions: Reaction[];
  comments: Comment[];
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  connectedPlatforms: Platform[];
  settings: UserSettings;
}

export interface Platform {
  type: "spotify" | "apple-music" | "youtube-music" | "soundcloud";
  isConnected: boolean;
  showCurrentlyListening: boolean;
  username?: string;
}

export interface UserSettings {
  showCurrentlyListening: boolean;
  allowReactions: boolean;
  allowComments: boolean;
  profileVisibility: "public" | "friends" | "private";
}

export interface Reaction {
  id: string;
  userId: string;
  type: "❤️" | "🔥" | "😍" | "🎵" | "💯" | "😢" | "🚀";
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface Feed {
  posts: MusicPost[];
  hasMore: boolean;
  nextCursor?: string;
}
