import type { TrendingItem, Friend, QuickActionType } from "./types";

export const getTrendingData = (): TrendingItem[] => [
  {
    id: "trending-1",
    emoji: "🔥",
    title: "Pop music is having a moment",
    description: "Latest pop hits trending worldwide",
  },
  {
    id: "trending-2",
    emoji: "🎸",
    title: "Rock revival playlist",
    description: "Classic rock making a comeback",
  },
  {
    id: "trending-3",
    emoji: "💎",
    title: "Hidden gems of 2024",
    description: "Undiscovered tracks worth listening to",
  },
];

export const getActiveFriends = (): Friend[] => [
  {
    id: "friend-1",
    name: "Alex",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=friend1",
    status: "🎵 Listening to Jazz",
    isOnline: true,
  },
  {
    id: "friend-2",
    name: "Sarah",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=friend2",
    status: "💭 Feeling nostalgic",
    isOnline: true,
  },
];

export const getQuickActionConfig = (action: QuickActionType) => {
  const configs = {
    "connect-spotify": {
      text: "🎵 Connect Spotify",
      className: "spotify",
    },
    "connect-apple": {
      text: "🍎 Connect Apple Music",
      className: "apple",
    },
    "connect-youtube": {
      text: "📺 Connect YouTube Music",
      className: "youtube",
    },
    "connect-soundcloud": {
      text: "☁️ Connect SoundCloud",
      className: "soundcloud",
    },
  };

  return configs[action];
};

export const handleQuickAction = async (
  action: QuickActionType,
  connectSpotify?: () => Promise<void>,
  connectAppleMusic?: () => Promise<void>,
  connectYouTubeMusic?: () => Promise<void>,
  connectSoundCloud?: () => Promise<void>
): Promise<void> => {
  try {
    console.log(`Executing quick action: ${action}`);

    switch (action) {
      case "connect-spotify": {
        if (connectSpotify) {
          await connectSpotify();
        } else {
          console.warn("Spotify connection function not provided");
        }
        break;
      }

      case "connect-apple": {
        if (connectAppleMusic) {
          await connectAppleMusic();
        } else {
          console.warn("Apple Music connection function not provided");
        }
        break;
      }

      case "connect-youtube": {
        if (connectYouTubeMusic) {
          await connectYouTubeMusic();
        } else {
          console.warn("YouTube Music connection function not provided");
        }
        break;
      }

      case "connect-soundcloud": {
        if (connectSoundCloud) {
          await connectSoundCloud();
        } else {
          console.warn("SoundCloud connection function not provided");
        }
        break;
      }

      default:
        console.warn(`Unknown quick action: ${action}`);
    }

    console.log(`Quick action completed: ${action}`);
  } catch (error) {
    console.error(`Failed to execute quick action ${action}:`, error);
    throw error;
  }
};
