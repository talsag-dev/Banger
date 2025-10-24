import { ReactionType } from "../types/music";
import type { Reaction } from "../types/music";

// Reaction mapping: enum to emoji display
export const REACTION_MAP: Record<ReactionType, string> = {
  [ReactionType.Love]: "❤️",
  [ReactionType.Fire]: "🔥",
  [ReactionType.HeartEyes]: "😍",
  [ReactionType.MusicalNote]: "🎵",
  [ReactionType.Hundred]: "💯",
  [ReactionType.Sad]: "😢",
  [ReactionType.Rocket]: "🚀",
} as const;

// Available reaction types for menus
export const AVAILABLE_REACTIONS = Object.values(ReactionType);

// Utility function to get emoji from reaction type
export const getReactionEmoji = (reactionType: ReactionType): string => {
  return REACTION_MAP[reactionType] || "❤️"; // fallback to heart
};

// Utility function to get reaction display name (for accessibility or tooltips)
export const getReactionDisplayName = (reactionType: ReactionType): string => {
  const displayNames: Record<ReactionType, string> = {
    [ReactionType.Love]: "Love",
    [ReactionType.Fire]: "Fire",
    [ReactionType.HeartEyes]: "Heart Eyes",
    [ReactionType.MusicalNote]: "Musical Note",
    [ReactionType.Hundred]: "Hundred",
    [ReactionType.Sad]: "Sad",
    [ReactionType.Rocket]: "Rocket",
  };

  return displayNames[reactionType] || "Love";
};

// Utility function to count reactions by type
export const countReactionsByType = (
  reactions: Reaction[]
): Record<ReactionType, number> => {
  return reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<ReactionType, number>);
};

// Utility function to get the most popular reaction
export const getMostPopularReaction = (
  reactions: Reaction[]
): ReactionType | null => {
  if (reactions.length === 0) return null;

  const counts = countReactionsByType(reactions);
  const mostPopular = Object.entries(counts).sort(([, a], [, b]) => b - a)[0];

  return mostPopular ? (mostPopular[0] as ReactionType) : null;
};
