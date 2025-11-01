import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../utils/http";

export interface UpdatePostData {
  feeling?: string;
  caption?: string;
}

export interface UpdatePostResponse {
  success: boolean;
  data: {
    post: unknown;
  };
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      postData,
    }: {
      postId: string;
      postData: UpdatePostData;
    }): Promise<UpdatePostResponse> => {
      return http<UpdatePostResponse>(`/posts/${postId}`, {
        method: "PUT",
        body: postData,
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
