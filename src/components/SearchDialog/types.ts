export interface SearchDialogProps {
  isOpen: boolean;
  searchQuery: string;
  onClose: () => void;
  onSearchQueryChange: (query: string) => void;
}

export interface SearchResult {
  id: string;
  type: "recent" | "trending" | "artist" | "song" | "user";
  title: string;
  subtitle?: string;
  emoji?: string;
}
