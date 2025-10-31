// Primary authentication providers (for creating Banger account)
export type AuthProvider = "google" | "apple" | "email";

// Music service integration providers (for music features)
export type MusicProvider =
  | "spotify"
  | "apple-music"
  | "youtube-music"
  | "soundcloud";

// Banger user account
export interface AuthUser {
  id: string;
  email: string;
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
  userId?: string; // Provider-specific user ID
  displayName?: string; // Provider-specific display name
  avatar?: string; // Provider-specific avatar
  connectedAt?: string;
  lastSyncAt?: string;
  hasValidToken: boolean;
  permissions: string[]; // What permissions we have
}

// Complete user profile with integrations
export interface UserProfile {
  user: AuthUser;
  musicIntegrations: Record<MusicProvider, MusicIntegration>;
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
    displayName: string
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
}

export interface AuthContextType extends AuthState, AuthActions {}
