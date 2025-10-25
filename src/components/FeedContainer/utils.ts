export const getLoadingMessage = (): string => "Loading your music feed...";

export const getErrorMessage = (error?: Error | null): string => {
  if (error?.message) {
    return `Failed to load feed: ${error.message}`;
  }
  return "Failed to load feed. Please try again.";
};

export const getFeedStats = (postsCount: number) => ({
  isEmpty: postsCount === 0,
  hasContent: postsCount > 0,
  message:
    postsCount === 0
      ? "Your feed is quiet"
      : `${postsCount} ${postsCount === 1 ? "post" : "posts"} in your feed`,
});

export const handleDiscoverPeople = async (): Promise<void> => {
  try {
    // In a real app, this would navigate to discover page or open discovery modal
    console.log("Opening discover people interface...");

    // Simulate navigation or API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Discover people interface opened");
  } catch (error) {
    console.error("Failed to open discover people:", error);
    throw error;
  }
};
