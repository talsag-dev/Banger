import type { MusicPost, Track } from "../types/music";

export const mockTracks: Track[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    albumCover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    duration: 200,
    platform: "spotify",
    externalUrl: "https://open.spotify.com/track/0VjIjW4GlULA6mT6xGqCE6",
    previewUrl: "https://p.scdn.co/mp3-preview/1234",
  },
  {
    id: "2",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    albumCover:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
    duration: 178,
    platform: "spotify",
    externalUrl: "https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    albumCover:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop",
    duration: 203,
    platform: "spotify",
    externalUrl: "https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9",
  },
];

export const mockPosts: MusicPost[] = [
  {
    id: "post-1",
    userId: "user-1",
    track: mockTracks[0],
    feeling: "🔥",
    caption: "This song never gets old! Perfect for late night drives",
    isCurrentlyListening: false,
    timestamp: "2024-10-25T10:30:00Z",
    reactions: [
      {
        id: "reaction-1",
        userId: "user-2",
        type: "fire",
        timestamp: "2024-10-25T10:35:00Z",
      },
      {
        id: "reaction-2",
        userId: "user-3",
        type: "love",
        timestamp: "2024-10-25T11:00:00Z",
      },
    ],
    comments: [
      {
        id: "comment-1",
        userId: "user-2",
        username: "music_lover",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        content: "Totally agree! This is my go-to driving song",
        timestamp: "2024-10-25T10:45:00Z",
      },
    ],
  },
  {
    id: "post-2",
    userId: "user-1",
    track: mockTracks[1],
    feeling: "💔",
    caption: "Feeling this one today...",
    isCurrentlyListening: true,
    timestamp: "2024-10-25T09:15:00Z",
    reactions: [
      {
        id: "reaction-3",
        userId: "user-4",
        type: "heart_eyes",
        timestamp: "2024-10-25T09:20:00Z",
      },
    ],
    comments: [],
  },
  {
    id: "post-3",
    userId: "user-1",
    track: mockTracks[2],
    feeling: "✨",
    caption: "Dance party for one! 💃",
    isCurrentlyListening: false,
    timestamp: "2024-10-24T20:00:00Z",
    reactions: [
      {
        id: "reaction-4",
        userId: "user-2",
        type: "fire",
        timestamp: "2024-10-24T20:05:00Z",
      },
      {
        id: "reaction-5",
        userId: "user-3",
        type: "musical_note",
        timestamp: "2024-10-24T20:10:00Z",
      },
      {
        id: "reaction-6",
        userId: "user-5",
        type: "love",
        timestamp: "2024-10-24T21:00:00Z",
      },
    ],
    comments: [
      {
        id: "comment-2",
        userId: "user-3",
        username: "dance_queen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b5ac?w=100&h=100&fit=crop&crop=face",
        content: "This song is such a vibe! 🕺",
        timestamp: "2024-10-24T20:15:00Z",
      },
      {
        id: "comment-3",
        userId: "user-5",
        username: "melody_maker",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        content: "Added to my playlist immediately!",
        timestamp: "2024-10-24T21:30:00Z",
      },
    ],
  },
];
