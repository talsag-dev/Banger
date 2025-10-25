import { useQuery } from "@tanstack/react-query";
import { FeedContainer } from "../components/FeedContainer";
import type { Feed } from "../types/music";

const fetchFeed = async (): Promise<Feed> => {
  const response = await fetch("/api/feed");
  if (!response.ok) {
    throw new Error("Failed to fetch feed");
  }
  return response.json();
};

export const Home: React.FC = () => {
  const {
    data: feed,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
  });

  const handleReaction = (postId: string, reaction: string) => {
    console.error("Failed to add reaction:", { postId, reaction });
  };

  const handleComment = (postId: string, comment: string) => {
    console.error("Failed to add comment:", { postId, comment });
  };

  return (
    <FeedContainer
      feed={feed}
      isLoading={isLoading}
      error={error}
      onReaction={handleReaction}
      onComment={handleComment}
      onDiscoverPeople={() => {
        console.log("Discover people clicked");
      }}
    />
  );
};
