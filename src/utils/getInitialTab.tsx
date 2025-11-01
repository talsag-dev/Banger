import type { ProfileTab } from "@pages/Profile/types";

export const getInitialTabFromUrl = (
  searchParams: URLSearchParams
): ProfileTab => {
  const tab = searchParams.get("tab");
  if (tab === "posts" || tab === "liked" || tab === "playlists") {
    return tab;
  }
  return "posts";
};
