export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
    release_date: string;
  };
  duration_ms: number;
  external_urls: { spotify: string };
  preview_url: string | null;
  popularity: number;
  explicit: boolean;
}

export interface SpotifySearchResponse {
  results: {
    tracks?: {
      items: SpotifyTrack[];
      total: number;
      limit: number;
      offset: number;
    };
    artists?: {
      items: Array<{
        id: string;
        name: string;
        images: Array<{ url: string; height: number; width: number }>;
        followers: { total: number };
        genres: string[];
      }>;
    };
    albums?: {
      items: Array<{
        id: string;
        name: string;
        artists: Array<{ id: string; name: string }>;
        images: Array<{ url: string; height: number; width: number }>;
        release_date: string;
      }>;
    };
  };
  query: string;
  type: string;
  success: boolean;
}

export interface SpotifyAuthResponse {
  authUrl: string;
  state: string;
  message: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  country: string;
  product: string;
}

export interface SpotifyCurrentlyPlaying {
  track: SpotifyTrack | null;
  isPlaying: boolean;
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
}

const BASE_URL = import.meta.env.VITE_SPOTIFY_API_URL || import.meta.env.VITE_API_URL || "https://localhost:3001/api";

class SpotifyApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAutoAuth: boolean = false
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
      credentials: "include", // Important for auth cookies
      headers: {
        "Content-Type": "application/json",
        // Removed ngrok header to avoid CORS issues
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Only auto-redirect if not checking auth status
        if (!skipAutoAuth) {
          const authResponse = await this.getAuthUrl();
          window.location.href = authResponse.authUrl;
        }
        throw new Error("Authentication required");
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const body = await response.json().catch(() => ({}));
    if (body && typeof body === "object" && "success" in body) {
      return (body.data as T) ?? (body as T);
    }
    return body as T;
  }

  async search(
    query: string,
    type: "track" | "artist" | "album" = "track",
    limit: number = 20
  ): Promise<SpotifySearchResponse> {
    const params = new URLSearchParams({
      q: query,
      type,
      limit: limit.toString(),
    });

    return this.makeRequest<SpotifySearchResponse>(`/spotify/search?${params}`);
  }

  async getAuthUrl(): Promise<SpotifyAuthResponse> {
    return this.makeRequest<SpotifyAuthResponse>("/spotify/auth");
  }

  async getProfile(): Promise<SpotifyUser> {
    const data = await this.makeRequest<{ profile: SpotifyUser }>("/spotify/profile");
    return data.profile;
  }

  async getCurrentlyPlaying(): Promise<SpotifyCurrentlyPlaying> {
    return this.makeRequest<SpotifyCurrentlyPlaying>("/spotify/currently-playing");
  }

  async getTopTracks(
    timeRange: string = "medium_term",
    limit: number = 20
  ): Promise<SpotifyTopTracksResponse> {
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString(),
    });

    return this.makeRequest<SpotifyTopTracksResponse>(
      `/spotify/top-tracks?${params}`
    );
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      await this.makeRequest<SpotifyUser>("/spotify/profile", {}, true); // Skip auto-auth
      return true;
    } catch {
      return false;
    }
  }
}

export const spotifyApi = new SpotifyApiService();
