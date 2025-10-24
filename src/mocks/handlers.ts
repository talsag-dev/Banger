import { http, HttpResponse } from "msw";
import type { Feed, MusicPost } from "../types/music";
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
  // Get feed
  http.get("/api/feed", () => {
    const feed: Feed = {
      posts: mockPosts,
      hasMore: false,
    };
    return HttpResponse.json(feed);
  }),

  // Get currently listening
  http.get("/api/users/:userId/currently-listening", ({ params }) => {
    const currentTrack = mockPosts.find(
      (post) => post.userId === params.userId && post.isCurrentlyListening
    )?.track;

    return HttpResponse.json(currentTrack || null);
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
