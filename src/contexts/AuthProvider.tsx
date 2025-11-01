import React, { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type {
  AuthUser,
  MusicProvider,
  MusicIntegration,
  AuthContextType,
} from "../types/auth";
import { AuthContext } from "./authContext";
import { http } from "../utils/http";
import { useInvalidateSpotifyQueries } from "../hooks/useSpotify";

interface AuthProviderProps {
  children: ReactNode;
}

const initialMusicIntegrations: Record<MusicProvider, MusicIntegration> = {
  spotify: {
    provider: "spotify",
    isConnected: false,
    hasValidToken: false,
    permissions: [],
  },
  "apple-music": {
    provider: "apple-music",
    isConnected: false,
    hasValidToken: false,
    permissions: [],
  },
  "youtube-music": {
    provider: "youtube-music",
    isConnected: false,
    hasValidToken: false,
    permissions: [],
  },
  soundcloud: {
    provider: "soundcloud",
    isConnected: false,
    hasValidToken: false,
    permissions: [],
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [musicIntegrations, setMusicIntegrations] = useState<
    Record<MusicProvider, MusicIntegration>
  >(initialMusicIntegrations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const invalidateSpotify = useInvalidateSpotifyQueries();

  // ===== DATA FETCHING =====

  const isFetchingRef = React.useRef(false);
  const refreshProfile = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Get current user - returns null on 401
      let userData: AuthUser | null = null;
      try {
        const data = await http<{ user: AuthUser }>(`/auth/me`);
        userData = data.user;
      } catch (err: any) {
        if (err.status === 401) {
          userData = null;
        } else {
          throw err;
        }
      }

      setUser(userData);

      // Only fetch music integrations if user is authenticated
      if (userData) {
        try {
          const integrationsData = await http<{
            integrations: MusicIntegration[];
          }>(`/auth/integrations`);

          // Transform array to Record<MusicProvider, MusicIntegration>
          const integrationsArray = integrationsData.integrations || [];
          const integrationsRecord: Partial<
            Record<MusicProvider, MusicIntegration>
          > = {};

          // Initialize all providers with default disconnected state
          const providers: MusicProvider[] = [
            "spotify",
            "apple-music",
            "youtube-music",
            "soundcloud",
          ];
          providers.forEach((provider) => {
            integrationsRecord[provider] = {
              provider,
              isConnected: false,
              hasValidToken: false,
              permissions: [],
            };
          });

          // Override with actual integration data
          integrationsArray.forEach((integration) => {
            integrationsRecord[integration.provider] = integration;
          });

          setMusicIntegrations(
            integrationsRecord as Record<MusicProvider, MusicIntegration>
          );
        } catch (integrationErr) {
          // Don't set error for music integrations failure - it's not critical
          console.warn("Failed to load music integrations:", integrationErr);
          setMusicIntegrations(initialMusicIntegrations);
        }
      } else {
        setMusicIntegrations(initialMusicIntegrations);
      }
    } catch {
      window.location.href = "/login";
      return;
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const refreshMusicIntegrations = useCallback(async () => {
    // Only refresh if user is authenticated
    if (!user) {
      setMusicIntegrations(initialMusicIntegrations);
      return;
    }

    try {
      const integrationsData = await http<{
        integrations: MusicIntegration[];
      }>(`/auth/integrations`);

      // Transform array to Record<MusicProvider, MusicIntegration>
      const integrationsArray = integrationsData.integrations || [];
      const integrationsRecord: Partial<
        Record<MusicProvider, MusicIntegration>
      > = {};

      const providers: MusicProvider[] = [
        "spotify",
        "apple-music",
        "youtube-music",
        "soundcloud",
      ];
      providers.forEach((provider) => {
        integrationsRecord[provider] = {
          provider,
          isConnected: false,
          hasValidToken: false,
          permissions: [],
        };
      });

      integrationsArray.forEach((integration) => {
        integrationsRecord[integration.provider] = integration;
      });

      setMusicIntegrations(
        integrationsRecord as Record<MusicProvider, MusicIntegration>
      );
    } catch (err) {
      console.warn("Failed to refresh music integrations:", err);
      // Don't set error for music integrations failure - it's not critical
      setMusicIntegrations(initialMusicIntegrations);
    }
  }, [user]);

  // ===== PRIMARY AUTHENTICATION (BANGER ACCOUNT) =====

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      const data = await http<{ authUrl: string }>(`/auth/google`);
      window.location.href = data.authUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Google authentication failed"
      );
    }
  }, []);

  const loginWithApple = useCallback(async () => {
    try {
      setError(null);
      const data = await http<{ authUrl: string }>(`/auth/apple`);
      window.location.href = data.authUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Apple authentication failed"
      );
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        setError(null);
        await http(`/auth/signup`, {
          method: "POST",
          body: JSON.stringify({ email, password, displayName }),
        });
        // Refresh profile after successful signup
        await refreshProfile();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign up failed");
        throw err;
      }
    },
    [refreshProfile]
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        await http(`/auth/login`, {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        // Refresh profile after successful login
        await refreshProfile();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
        throw err;
      }
    },
    [refreshProfile]
  );

  const logout = useCallback(async () => {
    try {
      setError(null);
      await http(`/auth/logout`, { method: "POST" });
      setUser(null);
      setMusicIntegrations(initialMusicIntegrations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    }
  }, []);

  // ===== MUSIC SERVICE INTEGRATIONS =====

  const connectSpotify = useCallback(async () => {
    try {
      setError(null);
      const data = await http<{ authUrl: string }>(`/spotify/auth`);
      window.location.href = data.authUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Spotify integration failed"
      );
    }
  }, []);

  const connectAppleMusic = useCallback(async () => {
    try {
      setError(null);
      const data = await http<{ authUrl: string }>(
        `/auth/integrations/apple-music/connect`
      );
      window.location.href = data.authUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Apple Music integration failed"
      );
    }
  }, []);

  const connectYouTubeMusic = useCallback(async () => {
    try {
      setError(null);
      const data = await http<{ authUrl: string }>(
        `/auth/integrations/youtube-music/connect`
      );
      window.location.href = data.authUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "YouTube Music integration failed"
      );
    }
  }, []);

  const connectSoundCloud = useCallback(async () => {
    try {
      setError(null);
      const data = await http<{ authUrl: string }>(
        `/auth/integrations/soundcloud/connect`
      );
      window.location.href = data.authUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "SoundCloud integration failed"
      );
    }
  }, []);

  const disconnectMusicService = useCallback(
    async (provider: MusicProvider) => {
      try {
        setError(null);
        await http(`/auth/integrations/${provider}/disconnect`, {
          method: "POST",
        });

        // Update local state
        setMusicIntegrations((prev) => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            isConnected: false,
            hasValidToken: false,
            userId: undefined,
            displayName: undefined,
            avatar: undefined,
            connectedAt: undefined,
            lastSyncAt: undefined,
          },
        }));
        if (provider === "spotify") {
          invalidateSpotify();
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : `Failed to disconnect ${provider}`
        );
      }
    },
    [invalidateSpotify]
  );

  // Initialize on mount
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const contextValue: AuthContextType = {
    // State
    isAuthenticated: !!user,
    isLoading,
    user,
    musicIntegrations,
    error,

    // Primary authentication actions
    loginWithGoogle,
    loginWithApple,
    signUpWithEmail,
    loginWithEmail,
    logout,

    // Music integration actions
    connectSpotify,
    connectAppleMusic,
    connectYouTubeMusic,
    connectSoundCloud,
    disconnectMusicService,

    // Refresh actions
    refreshProfile,
    refreshMusicIntegrations,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
