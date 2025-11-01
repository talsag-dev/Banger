import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@utils/http";

export interface FollowUserResponse {
  success: boolean;
  data: {
    isFollowing: boolean;
    followersCount?: number;
  };
}

export interface ToggleFollowParams {
  userId: string;
  type: "follow" | "unfollow";
}

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      type,
    }: ToggleFollowParams): Promise<FollowUserResponse> => {
      // Use DELETE for unfollow, POST for follow
      const method = type === "unfollow" ? "DELETE" : "POST";
      return http<FollowUserResponse>(`/users/${userId}/follow`, {
        method,
      });
    },
    onSuccess: (_, { userId }) => {
      // Invalidate all relevant queries to refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
