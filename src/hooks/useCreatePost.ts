import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@utils/http";

export interface CreatePostData {
  track_id: string;
  track_name: string;
  artist_name: string;
  album_name?: string;
  track_image?: string;
  track_preview_url?: string;
  track_external_url?: string;
  caption?: string;
  feeling?: string;
  is_currently_listening?: boolean;
}

export interface CreatePostResponse {
  success: boolean;
  data: {
    post: unknown;
  };
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      postData: CreatePostData
    ): Promise<CreatePostResponse> => {
      return http<CreatePostResponse>("/posts", {
        method: "POST",
        body: postData,
      });
    },
    onSuccess: () => {
      // Invalidate posts queries to refetch the feed
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
