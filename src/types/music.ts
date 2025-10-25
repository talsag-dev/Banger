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

export interface UserProfile extends User {
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean; // undefined for own profile
  spotifyConnected: boolean;
  appleConnected: boolean;
  joinedDate: string;
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

export const ReactionType = {
  Love: "love",
  Fire: "fire",
  HeartEyes: "heart_eyes",
  MusicalNote: "musical_note",
  Hundred: "hundred",
  Sad: "sad",
  Rocket: "rocket",
} as const;

export type ReactionType = (typeof ReactionType)[keyof typeof ReactionType];

export interface Reaction {
  id: string;
  userId: string;
  type: ReactionType;
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
