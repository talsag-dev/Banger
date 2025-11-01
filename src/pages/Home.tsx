import { useQuery } from "@tanstack/react-query";
import { FeedContainer } from "@components/FeedContainer";
import type { Feed, MusicPost } from "@types";
import { http } from "@utils/http";

const fetchFeed = async (): Promise<Feed> => {
  const data = await http<{ posts: MusicPost[] }>(`/posts`);
  return {
    posts: data.posts || [],
    hasMore: false,
  };
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
