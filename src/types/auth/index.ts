export type AuthProvider = "google" | "apple" | "email";

export type MusicProvider =
  | "spotify"
  | "apple-music"
  | "youtube-music"
  | "soundcloud";

// Banger user account
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  displayName: string;
  avatar?: string;
  authProvider: AuthProvider; // How they signed up
  createdAt: string;
  updatedAt: string;
}

// Music service integration status
export interface MusicIntegration {
  provider: MusicProvider;
  isConnected: boolean;
  userId?: string;
  displayName?: string;
  avatar?: string;
  connectedAt?: string;
  lastSyncAt?: string;
  hasValidToken: boolean;
  permissions: string[];
}

export interface UserSettings {
  showCurrentlyListening: boolean;
  allowReactions: boolean;
  allowComments: boolean;
  profileVisibility: "public" | "friends" | "private";
}

// Complete user profile with integrations
export interface UserProfile {
  user: AuthUser;
  settings: UserSettings;
  bio?: string;
  displayName: string;
  username: string;
  avatar?: string;
  id: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  spotifyConnected: boolean;
  appleConnected: boolean;
  soundcloudConnected: boolean;
  joinedDate: string;
  connectedPlatforms: Array<{
    type: MusicProvider;
    isConnected: boolean;
    showCurrentlyListening: boolean;
    username?: string;
  }>;
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  musicIntegrations: Record<MusicProvider, MusicIntegration>;
  error: string | null;
}

// Auth actions
export interface AuthActions {
  // Primary authentication (Banger account creation/login)
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
    username: string
  ) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Music service integrations (optional features)
  connectSpotify: () => Promise<void>;
  connectAppleMusic: () => Promise<void>;
  connectYouTubeMusic: () => Promise<void>;
  connectSoundCloud: () => Promise<void>;

  // Disconnect music services
  disconnectMusicService: (provider: MusicProvider) => Promise<void>;

  // Refresh data
  refreshProfile: () => Promise<void>;
  refreshMusicIntegrations: () => Promise<void>;

  // Update profile
  updateProfile: (data: {
    username?: string;
    displayName?: string;
    bio?: string;
  }) => Promise<void>;
}

export interface AuthContextType extends AuthState, AuthActions {}
