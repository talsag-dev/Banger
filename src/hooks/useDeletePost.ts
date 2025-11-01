import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../utils/http";

export interface DeletePostResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string): Promise<DeletePostResponse> => {
      return http<DeletePostResponse>(`/posts/${postId}`, {
        method: "DELETE",
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
