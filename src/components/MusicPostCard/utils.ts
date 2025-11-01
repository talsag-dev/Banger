import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getTimeAgo = (timestamp: string): string => {
  try {
    // Backend now always sends UTC ISO strings (with 'Z' suffix)
    // So we can directly parse with date-fns parseISO
    const postDate = parseISO(timestamp);

    // Verify the date is valid
    if (!isValid(postDate)) {
      console.warn("Invalid timestamp:", timestamp);
      return "Just now";
    }

    // Get current time
    const now = new Date();

    // Calculate difference in milliseconds
    const diffMs = now.getTime() - postDate.getTime();

    // Handle future dates (shouldn't happen, but just in case)
    if (diffMs < 0) {
      return "Just now";
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffDays = Math.floor(diffSeconds / 86400);

    // For very recent posts (< 1 minute)
    if (diffSeconds < 60) {
      return "Just now";
    }

    // For posts older than 7 days, show the date
    if (diffDays >= 7) {
      return format(postDate, "MMM d, yyyy");
    }

    // Use date-fns formatDistanceToNow for relative time
    // This automatically handles timezone correctly since backend sends UTC ISO strings
    const distance = formatDistanceToNow(postDate, {
      addSuffix: true,
      includeSeconds: false,
    });

    // Clean up the output (remove "about" prefix if present)
    return distance.replace(/^about /, "");
  } catch (error) {
    console.error("Error parsing timestamp:", timestamp, error);
    return "Just now";
  }
};
