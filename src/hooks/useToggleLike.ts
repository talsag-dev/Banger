import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../utils/http";

export interface ToggleLikeResponse {
  success: boolean;
  data: {
    liked: boolean;
  };
}

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string): Promise<ToggleLikeResponse> => {
      return http<ToggleLikeResponse>(`/posts/${postId}/like`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      // Invalidate all relevant queries to refetch the feed and profile data
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
    },
  });
};

