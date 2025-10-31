import type { MusicProvider, AuthUser, MusicIntegration } from "../types/auth";
import { http } from "./http";

class AuthService {
  private baseUrl =
    import.meta.env.VITE_API_URL || "https://localhost:3001/api";

  // ===== PRIMARY AUTHENTICATION (BANGER ACCOUNT) =====

  async loginWithGoogle(): Promise<string> {
    const data = await http<{ authUrl: string }>(`/auth/google`);
    return data.authUrl;
  }

  async loginWithApple(): Promise<string> {
    const data = await http<{ authUrl: string }>(`/auth/apple`);
    return data.authUrl;
  }

  async signUpWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    await http(`/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    });
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await http(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    await http(`/auth/logout`, { method: "POST" });
  }

  // ===== USER PROFILE =====

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/me`, {
        credentials: "include",
      });
      if (res.status === 401) {
        return null; // Not authenticated
      }

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const body = await res.json();
      // Support both legacy { user } and new { success, data: { user } }
      if (body && typeof body === "object") {
        if (body.user) return body.user as AuthUser;
        if (body.data?.user) return body.data.user as AuthUser;
      }
      return null;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const data = await http<{ authenticated: boolean }>(`/auth/status`);
      return data.authenticated;
    } catch (err) {
      console.error("Error checking auth status:", err);
      return false;
    }
  }

  // ===== MUSIC SERVICE INTEGRATIONS =====

  async connectSpotify(): Promise<string> {
    const data = await http<{ authUrl: string }>(`/spotify/auth`);
    return data.authUrl;
  }

  async connectAppleMusic(): Promise<string> {
    const data = await http<{ authUrl: string }>(
      `/auth/integrations/apple-music/connect`
    );
    return data.authUrl;
  }

  async connectYouTubeMusic(): Promise<string> {
    const data = await http<{ authUrl: string }>(
      `/auth/integrations/youtube-music/connect`
    );
    return data.authUrl;
  }

  async connectSoundCloud(): Promise<string> {
    const data = await http<{ authUrl: string }>(
      `/auth/integrations/soundcloud/connect`
    );
    return data.authUrl;
  }

  async disconnectMusicService(provider: MusicProvider): Promise<void> {
    await http(`/auth/integrations/${provider}/disconnect`, { method: "POST" });
  }

  async getMusicIntegrations(): Promise<
    Record<MusicProvider, MusicIntegration>
  > {
    try {
      const data = await http<{
        integrations: Record<MusicProvider, MusicIntegration>;
      }>(`/auth/integrations`);
      return data.integrations;
    } catch (err) {
      console.error("Error fetching music integrations:", err);
      throw err;
    }
  }
}

export const authService = new AuthService();
