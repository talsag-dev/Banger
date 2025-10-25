import type { SearchResult } from "./types";

export const getRecentSearches = (): SearchResult[] => [
  {
    id: "recent-1",
    type: "recent",
    title: "Taylor Swift",
    emoji: "🎵",
  },
  {
    id: "recent-2",
    type: "recent",
    title: "Chill vibes",
    emoji: "💭",
  },
];

export const getTrendingResults = (): SearchResult[] => [
  {
    id: "trending-1",
    type: "trending",
    title: "Bad Habit",
    subtitle: "Steve Lacy",
    emoji: "🔥",
  },
  {
    id: "trending-2",
    type: "trending",
    title: "As It Was",
    subtitle: "Harry Styles",
    emoji: "🎶",
  },
];

export const filterSearchResults = (
  query: string,
  allResults: SearchResult[]
): SearchResult[] => {
  if (!query.trim()) return allResults;

  return allResults.filter(
    (result) =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(query.toLowerCase())
  );
};
