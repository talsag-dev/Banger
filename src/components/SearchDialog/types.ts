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
  onAuthRedirect: () => void;
}

export interface SearchResult {
  id: string;
  type: "recent" | "trending" | "artist" | "song" | "user";
  title: string;
  subtitle?: string;
  emoji?: string;
}
