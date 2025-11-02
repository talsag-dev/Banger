import { useQuery } from "@tanstack/react-query";
import { http } from "../utils/http";

export interface UserSearchResult {
  id: string;
  username: string | null;
  email: string | null;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface UserSearchResponse {
  users: UserSearchResult[];
}

export const useUserSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: async (): Promise<UserSearchResponse> => {
      const params = new URLSearchParams({ q: query });
      // http utility extracts data when success is present
      return http<{ users: UserSearchResult[] }>(`/users/search?${params}`);
    },
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

