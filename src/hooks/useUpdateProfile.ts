import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../utils/http";
import type { AuthUser } from "../types/auth";

export interface UpdateProfileData {
  username?: string;
  displayName?: string;
  bio?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      profileData: UpdateProfileData
    ): Promise<UpdateProfileResponse> => {
      return http<UpdateProfileResponse>(`/users/profile`, {
        method: "PUT",
        body: profileData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
