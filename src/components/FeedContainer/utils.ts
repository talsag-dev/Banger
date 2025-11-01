export const getLoadingMessage = (): string => "Loading your music feed...";

export const getErrorMessage = (error?: Error | null): string => {
  if (error?.message) {
    return `Failed to load feed: ${error.message}`;
  }
  return "Failed to load feed. Please try again.";
};

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
