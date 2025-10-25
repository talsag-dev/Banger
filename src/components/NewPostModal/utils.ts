import type { PlatformType } from "./types";

export const handlePlatformConnection = async (
  platform: PlatformType
): Promise<void> => {
  try {
    // In a real app, this would handle OAuth flows
    console.log(`Connecting to ${platform}...`);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Handle success/error states
    console.log(`Successfully connected to ${platform}`);
  } catch (error) {
    console.error(`Failed to connect to ${platform}:`, error);
    throw error;
  }
};

export const getPlatformConfig = (platform: PlatformType) => {
  const configs = {
    spotify: {
      name: "Spotify",
      className: "spotify",
      buttonText: "Connect Spotify",
    },
    "apple-music": {
      name: "Apple Music",
      className: "apple",
      buttonText: "Connect Apple Music",
    },
  };

  return configs[platform];
};
