import { http, HttpResponse } from "msw";
import type { MusicPost, UserProfile } from "@types";
import { ReactionType } from "../types/music";

// Mock data
const mockPosts: MusicPost[] = [
  {
    id: "1",
    userId: "user1",
    track: {
      id: "track1",
      title: "Anti-Hero",
      artist: "Taylor Swift",
      album: "Midnights",
      albumCover:
        "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5",
      duration: 200,
      platform: "spotify",
      externalUrl: "https://open.spotify.com/track/0V3wPSX9ygBnCm8psDIegu",
      previewUrl: "https://p.scdn.co/mp3-preview/example",
    },
    feeling: "Feeling nostalgic 🌙",
    caption: "This song hits different at 2am",
    isCurrentlyListening: true,
    timestamp: new Date().toISOString(),
    reactions: [
      {
        id: "r1",
        userId: "user2",
        type: ReactionType.Love,
        timestamp: new Date().toISOString(),
      },
      {
        id: "r2",
        userId: "user3",
        type: ReactionType.Fire,
        timestamp: new Date().toISOString(),
      },
    ],
    comments: [
      {
        id: "c1",
        userId: "user2",
        username: "musiclover22",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
        content: "Absolute banger! 🎵",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    userId: "user2",
    track: {
      id: "track2",
      title: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
      albumCover: "https://picsum.photos/300/300?random=2",
      duration: 167,
      platform: "apple-music",
      externalUrl:
        "https://music.apple.com/album/as-it-was/1615584999?i=1615585012",
    },
    feeling: "Vibing hard 🎶",
    isCurrentlyListening: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    reactions: [
      {
        id: "r3",
        userId: "user1",
        type: ReactionType.HeartEyes,
        timestamp: new Date().toISOString(),
      },
    ],
    comments: [],
  },
  {
    id: "3",
    userId: "user3",
    track: {
      id: "track3",
      title: "Bad Habit",
      artist: "Steve Lacy",
      album: "Gemini Rights",
      albumCover: "https://picsum.photos/300/300?random=3",
      duration: 217,
      platform: "spotify",
      externalUrl: "https://open.spotify.com/track/4k6Uh1HXdhtusDW5y8Gbdh",
    },
    caption: "This song is everything! Perfect for Sunday vibes ☀️",
    isCurrentlyListening: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    reactions: [
      {
        id: "r4",
        userId: "user1",
        type: ReactionType.Fire,
        timestamp: new Date().toISOString(),
      },
      {
        id: "r5",
        userId: "user2",
        type: ReactionType.Hundred,
        timestamp: new Date().toISOString(),
      },
    ],
    comments: [
      {
        id: "c2",
        userId: "user1",
        username: "beatdrop",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        content: "Steve Lacy never misses!",
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

export const handlers = [
  // Get posts (Home feed) - wildcard for cross-origin requests
  http.get("*/api/posts", () => {
    return HttpResponse.json({
      success: true,
      data: { posts: mockPosts },
    });
  }),

  // Get liked posts by user ID - wildcard for cross-origin requests
  http.get("*/api/posts/user/:userId/liked", ({ params }) => {
    const { userId } = params as { userId: string };

    // For user 12, return some liked posts (posts that user 12 has liked)
    // These are posts by other users that user 12 has reacted to
    if (userId === "12") {
      const likedPosts: MusicPost[] = [
        {
          id: "liked-1",
          userId: "1", // Post by user 1, liked by user 12
          track: {
            id: "track-liked-1",
            title: "Midnight City",
            artist: "M83",
            album: "Hurry Up, We're Dreaming",
            albumCover:
              "https://i.scdn.co/image/ab67616d0000b2732a038d0bf2af8ad3f9a1e8e7",
            duration: 242,
            platform: "spotify",
            externalUrl:
              "https://open.spotify.com/track/1eyzqe2QqGZ1fcbQ5MdU0g",
            previewUrl: "https://p.scdn.co/mp3-preview/example",
          },
          feeling: "Epic vibes 🎆",
          caption: "One of my all-time favorites",
          isCurrentlyListening: false,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          reactions: [
            {
              id: "r-liked-1",
              userId: "12",
              type: ReactionType.Fire,
              timestamp: new Date().toISOString(),
            },
          ],
          comments: [],
        },
        {
          id: "liked-2",
          userId: "2", // Post by user 2, liked by user 12
          track: {
            id: "track-liked-2",
            title: "Electric Feel",
            artist: "MGMT",
            album: "Oracular Spectacular",
            albumCover:
              "https://i.scdn.co/image/ab67616d0000b2732a038d0bf2af8ad3f9a1e8e8",
            duration: 239,
            platform: "spotify",
            externalUrl:
              "https://open.spotify.com/track/3FtYbEfBqAlGO46NUDQSAt",
            previewUrl: "https://p.scdn.co/mp3-preview/example",
          },
          caption: "This hits different ✨",
          isCurrentlyListening: false,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          reactions: [
            {
              id: "r-liked-2",
              userId: "12",
              type: ReactionType.Love,
              timestamp: new Date().toISOString(),
            },
          ],
          comments: [],
        },
        {
          id: "liked-3",
          userId: "3", // Post by user 3, liked by user 12
          track: {
            id: "track-liked-3",
            title: "Get Lucky",
            artist: "Daft Punk",
            album: "Random Access Memories",
            albumCover:
              "https://i.scdn.co/image/ab67616d0000b2732a038d0bf2af8ad3f9a1e8e9",
            duration: 248,
            platform: "spotify",
            externalUrl:
              "https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq",
            previewUrl: "https://p.scdn.co/mp3-preview/example",
          },
          feeling: "Classic! 🎹",
          isCurrentlyListening: false,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          reactions: [
            {
              id: "r-liked-3",
              userId: "12",
              type: ReactionType.HeartEyes,
              timestamp: new Date().toISOString(),
            },
          ],
          comments: [],
        },
      ];

      return HttpResponse.json({
        success: true,
        data: { posts: likedPosts },
      });
    }

    // For other users, return empty array or filter existing posts
    return HttpResponse.json({
      success: true,
      data: { posts: [] },
    });
  }),

  // Get playlists by user ID - wildcard for cross-origin requests
  http.get("*/api/users/:userId/playlists", ({ params }) => {
    const { userId } = params as { userId: string };

    // Return mock playlists for user 12
    if (userId === "12") {
      const mockPlaylists = [
        {
          id: "playlist-1",
          name: "My Liked Songs",
          description: "Songs you've liked",
          image: "https://misc.scdn.co/liked-songs/liked-songs-300.png",
          owner: "User 12",
          provider: "spotify",
          trackCount: 127,
          externalUrl: "https://open.spotify.com/collection/tracks",
        },
        {
          id: "playlist-2",
          name: "Chill Vibes",
          description: "Perfect for relaxing",
          image:
            "https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548d15c",
          owner: "User 12",
          provider: "spotify",
          trackCount: 45,
          externalUrl:
            "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
        },
        {
          id: "playlist-3",
          name: "Workout Mix",
          description: "Energy booster tracks",
          image:
            "https://i.scdn.co/image/ab67706f000000027ea4d505212b8deee2fc72ee",
          owner: "User 12",
          provider: "spotify",
          trackCount: 62,
          externalUrl:
            "https://open.spotify.com/playlist/37i9dQZF1DX76WlfdH3Omw",
        },
        {
          id: "playlist-4",
          name: "Late Night Drive",
          description: "Songs for the road",
          owner: "User 12",
          provider: "spotify",
          trackCount: 38,
          externalUrl:
            "https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk",
        },
      ];

      return HttpResponse.json({
        success: true,
        data: { playlists: mockPlaylists },
      });
    }

    // For other users, return empty array
    return HttpResponse.json({
      success: true,
      data: { playlists: [] },
    });
  }),

  // Get posts by user ID - wildcard for cross-origin requests
  http.get("*/api/posts/user/:userId", ({ params }) => {
    const { userId } = params as { userId: string };

    // Filter posts by userId
    // Note: mockPosts use "user1", "user2", etc., but real API uses numeric IDs
    // For user "12", return some posts. For other numeric IDs, map to existing users
    let filteredPosts: MusicPost[];

    if (userId === "12") {
      // Create specific posts for user 12
      filteredPosts = [
        {
          id: "12-1",
          userId: "12",
          track: {
            id: "track12-1",
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            albumCover:
              "https://i.scdn.co/image/ab67616d0000b2732a038d0bf2af8ad3f9a1e8e4",
            duration: 200,
            platform: "spotify",
            externalUrl:
              "https://open.spotify.com/track/0VjIjW4GlU5Ur24vQq0XNH",
            previewUrl: "https://p.scdn.co/mp3-preview/example",
          },
          feeling: "Late night vibes 🌃",
          caption: "This never gets old",
          isCurrentlyListening: false,
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
          reactions: [
            {
              id: "r12-1",
              userId: "user1",
              type: ReactionType.Fire,
              timestamp: new Date().toISOString(),
            },
          ],
          comments: [],
        },
        {
          id: "12-2",
          userId: "12",
          track: {
            id: "track12-2",
            title: "Levitating",
            artist: "Dua Lipa",
            album: "Future Nostalgia",
            albumCover:
              "https://i.scdn.co/image/ab67616d0000b2732a038d0bf2af8ad3f9a1e8e5",
            duration: 203,
            platform: "spotify",
            externalUrl:
              "https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9",
            previewUrl: "https://p.scdn.co/mp3-preview/example",
          },
          feeling: "Dancing in my room 💃",
          isCurrentlyListening: true,
          timestamp: new Date().toISOString(),
          reactions: [],
          comments: [
            {
              id: "c12-1",
              userId: "user2",
              username: "musiclover22",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
              content: "Such a vibe! 🔥",
              timestamp: new Date().toISOString(),
            },
          ],
        },
        {
          id: "12-3",
          userId: "12",
          track: {
            id: "track12-3",
            title: "Watermelon Sugar",
            artist: "Harry Styles",
            album: "Fine Line",
            albumCover:
              "https://i.scdn.co/image/ab67616d0000b2732a038d0bf2af8ad3f9a1e8e6",
            duration: 174,
            platform: "spotify",
            externalUrl:
              "https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY",
            previewUrl: "https://p.scdn.co/mp3-preview/example",
          },
          caption: "Summer vibes all year round ☀️",
          isCurrentlyListening: false,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          reactions: [
            {
              id: "r12-2",
              userId: "user3",
              type: ReactionType.HeartEyes,
              timestamp: new Date().toISOString(),
            },
            {
              id: "r12-3",
              userId: "user1",
              type: ReactionType.Love,
              timestamp: new Date().toISOString(),
            },
          ],
          comments: [],
        },
      ];
    } else {
      // For other userIds, try to match with existing mock data
      // Map numeric IDs to "user1", "user2", etc., or return empty
      const userMap: Record<string, string> = {
        "1": "user1",
        "2": "user2",
        "3": "user3",
      };
      const mappedUserId = userMap[userId] || userId;
      filteredPosts = mockPosts.filter((post) => post.userId === mappedUserId);
    }

    return HttpResponse.json({
      success: true,
      data: { posts: filteredPosts },
    });
  }),

  // Get currently listening
  http.get("/api/users/:userId/currently-listening", ({ params }) => {
    const currentTrack = mockPosts.find(
      (post) => post.userId === params.userId && post.isCurrentlyListening
    )?.track;

    return HttpResponse.json(currentTrack || null);
  }),

  http.get("/api/users/:userId/profile", ({ params }) => {
    const { userId } = params as { userId: string };
    const profile: UserProfile = {
      user: {
        id: userId || "current-user",
        email: userId ? "john@example.com" : "you@example.com",
        displayName: userId ? "John Doe" : "Your Name",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        authProvider: "email",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      id: userId || "current-user",
      username: userId ? "john_doe" : "you",
      displayName: userId ? "John Doe" : "Your Name",
      bio: userId
        ? "Music lover 🎵 | Discovering new sounds daily"
        : "Share your musical journey",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      followersCount: 1250,
      followingCount: 380,
      postsCount: 42,
      isFollowing: !!userId && userId !== "current-user",
      spotifyConnected: true,
      appleConnected: false,
      joinedDate: "2024-01-15",
      connectedPlatforms: [
        { type: "spotify", isConnected: true, showCurrentlyListening: true },
      ],
      settings: {
        showCurrentlyListening: true,
        allowReactions: true,
        allowComments: true,
        profileVisibility: "public",
      },
    };
    return HttpResponse.json(profile);
  }),

  // Get comments for a post
  http.get("/api/posts/:postId/comments", ({ params }) => {
    const post = mockPosts.find((p) => p.id === params.postId);
    return HttpResponse.json(post?.comments || []);
  }),

  // Add reaction
  http.post("/api/posts/:postId/reactions", async ({ request }) => {
    const { type } = (await request.json()) as { type: string };
    const reaction = {
      id: Math.random().toString(36),
      userId: "current-user",
      type,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(reaction);
  }),

  // Add comment
  http.post("/api/posts/:postId/comments", async ({ request }) => {
    const { content } = (await request.json()) as { content: string };
    const comment = {
      id: Math.random().toString(36),
      userId: "current-user",
      username: "you",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current-user",
      content,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(comment);
  }),
];
