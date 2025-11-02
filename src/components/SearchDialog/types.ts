export interface SearchDialogProps {
  isOpen: boolean;
  searchQuery: string;
  onClose: () => void;
  onSearchQueryChange: (query: string) => void;
  // Data and state passed from container
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  authError: Error | null;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchError: Error | null;
}

export interface SearchResult {
  id: string;
  type: "recent" | "trending" | "artist" | "song" | "user";
  title: string;
  subtitle?: string;
  emoji?: string;
  user?: {
    id: string;
    username: string | null;
    email: string | null;
    displayName: string | null;
    avatar: string | null;
    bio: string | null;
  };
}
