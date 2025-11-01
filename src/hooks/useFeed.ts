import { useQuery } from "@tanstack/react-query";
import { http } from "@utils/http";
import type { Feed, MusicPost } from "@types";

export const useFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async (): Promise<Feed> => {
      const data = await http<{ posts: MusicPost[] }>(`/posts/feed`);
      return {
        posts: data.posts || [],
        hasMore: false,
      };
    },
  });
};

