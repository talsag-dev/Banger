import React, { useReducer, useMemo, useRef, useEffect } from "react";
import {
  Field,
  Label,
  ComboboxOptions,
  ComboboxOption,
  Combobox,
  ComboboxInput,
  ComboboxButton,
} from "@headlessui/react";
import {
  Search,
  X,
  Loader2,
  Music,
  AlertCircle,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { Text } from "../Text";
import { PlatformIcon } from "../PlatformIcon";
import { useSpotifySearch } from "../../hooks/useSpotify";
import { useDebounce } from "../../hooks/useDebounce";
import { useCreatePost } from "../../hooks/useCreatePost";
import { useUpdatePost } from "../../hooks/useUpdatePost";
import { getAlbumImage } from "../../utils/spotifyUtils";
import type { SpotifyTrack } from "../../types/spotify";
import type { MusicPost } from "../../types/music";
import type { NewPostModalProps } from "./types";
import styles from "./NewPostModal.module.css";
import { useAuth } from "../../hooks/useAuth";

interface NewPostState {
  searchQuery: string;
  selectedTrack: SpotifyTrack | null;
  caption: string;
  feeling: string;
  error: string | null;
}

// Action types
type NewPostAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SELECT_TRACK"; payload: SpotifyTrack | null }
  | { type: "CLEAR_TRACK" }
  | { type: "SET_CAPTION"; payload: string }
  | { type: "SET_FEELING"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

const getInitialState = (post?: MusicPost | null): NewPostState => {
  if (post) {
    const spotifyTrack: SpotifyTrack = {
      id: post.track.id,
      name: post.track.title,
      artists: [{ id: "", name: post.track.artist }],
      album: {
        id: "",
        name: post.track.album,
        images: [{ url: post.track.albumCover, height: 300, width: 300 }],
        release_date: "",
      },
      duration_ms: 0,
      external_urls: { spotify: post.track.externalUrl },
      preview_url: post.track.previewUrl || null,
      popularity: 0,
      explicit: false,
    };
    return {
      searchQuery: post.track.title,
      selectedTrack: spotifyTrack,
      caption: post.caption || "",
      feeling: post.feeling || "",
      error: null,
    };
  }
  return {
    searchQuery: "",
    selectedTrack: null,
    caption: "",
    feeling: "",
    error: null,
  };
};

const newPostReducer = (
  state: NewPostState,
  action: NewPostAction
): NewPostState => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SELECT_TRACK":
      if (action.payload) {
        return {
          ...state,
          selectedTrack: action.payload,
          searchQuery: action.payload.name,
        };
      } else {
        return {
          ...state,
          selectedTrack: null,
        };
      }
    case "CLEAR_TRACK":
      return {
        ...state,
        selectedTrack: null,
      };
    case "SET_CAPTION":
      return { ...state, caption: action.payload };
    case "SET_FEELING":
      return { ...state, feeling: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return getInitialState();
    default:
      return state;
  }
};

// Helper to convert MusicPost track to SpotifyTrack format
const convertTrackToSpotifyTrack = (track: {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumCover: string;
  externalUrl: string;
  previewUrl?: string;
}): SpotifyTrack => {
  return {
    id: track.id,
    name: track.title,
    artists: [{ id: "", name: track.artist }],
    album: {
      id: "",
      name: track.album,
      images: [{ url: track.albumCover, height: 300, width: 300 }],
      release_date: "",
    },
    duration_ms: 0,
    external_urls: { spotify: track.externalUrl },
    preview_url: track.previewUrl || null,
    popularity: 0,
    explicit: false,
  };
};

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  onPostUpdated,
  post,
}) => {
  const { isAuthenticated, musicIntegrations } = useAuth();
  const isEditMode = !!post;
  const [state, dispatch] = useReducer(newPostReducer, getInitialState(post));

  // Check if any music service is connected
  const hasMusicServiceConnected = useMemo(() => {
    return Object.values(musicIntegrations).some(
      (integration) => integration.isConnected && integration.hasValidToken
    );
  }, [musicIntegrations]);

  const {
    mutateAsync: createPost,
    isPending: isCreating,
    error: createPostError,
  } = useCreatePost();

  const {
    mutateAsync: updatePost,
    isPending: isUpdating,
    error: updatePostError,
  } = useUpdatePost();

  const isSubmitting = isCreating || isUpdating;

  const debouncedSearchQuery = useDebounce(state.searchQuery, 300);
  const shouldSearch =
    debouncedSearchQuery.length > 0 &&
    state.selectedTrack === null &&
    hasMusicServiceConnected;

  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useSpotifySearch(
    debouncedSearchQuery,
    shouldSearch && isAuthenticated && hasMusicServiceConnected
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchResponse?.results?.tracks?.items) return [];
    return searchResponse.results.tracks.items.slice(0, 10);
  }, [searchResponse]);

  // Sync state when modal opens or post prop changes
  useEffect(() => {
    // Only initialize/reset when modal is opening (isOpen becomes true)
    if (!isOpen) {
      return;
    }

    // When modal opens, initialize state based on post prop
    if (post) {
      const spotifyTrack = convertTrackToSpotifyTrack(post.track);
      dispatch({
        type: "SELECT_TRACK",
        payload: spotifyTrack,
      });
      dispatch({ type: "SET_CAPTION", payload: post.caption || "" });
      dispatch({ type: "SET_FEELING", payload: post.feeling || "" });
    } else {
      // Reset when opening in create mode
      dispatch({ type: "RESET" });
    }
  }, [post, isOpen]);

  const handleTrackSelect = (track: SpotifyTrack | null) => {
    if (track) {
      dispatch({ type: "SELECT_TRACK", payload: track });
    } else {
      dispatch({ type: "RESET" });
    }
  };

  const handleClearSelection = () => {
    dispatch({ type: "RESET" });
  };

  const handleSubmit = async () => {
    if (isEditMode) {
      // Update mode - only update caption and feeling
      if (!post) return;

      dispatch({ type: "SET_ERROR", payload: null });

      try {
        await updatePost({
          postId: post.id,
          postData: {
            caption: state.caption.trim() || undefined,
            feeling: state.feeling.trim() || undefined,
          },
        });

        onPostUpdated?.();
        onClose();
        // State will be reset when modal opens again
      } catch (error) {
        console.error("Failed to update post:", error);
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to update post",
        });
      }
    } else {
      // Create mode
      if (!state.selectedTrack) {
        dispatch({
          type: "SET_ERROR",
          payload: "Please select a track first",
        });
        return;
      }

      dispatch({ type: "SET_ERROR", payload: null });

      const artistNames = state.selectedTrack.artists
        .map((a) => a.name)
        .join(", ");
      const albumImage = getAlbumImage(state.selectedTrack, "large");

      // Get external URL - prefer provider-specific URL, fallback to spotify
      const externalUrl =
        (state.selectedTrack.provider === "soundcloud"
          ? state.selectedTrack.external_urls.soundcloud
          : state.selectedTrack.external_urls.spotify) || undefined;

      try {
        await createPost({
          track_id: state.selectedTrack.id,
          track_name: state.selectedTrack.name,
          artist_name: artistNames,
          album_name: state.selectedTrack.album.name,
          track_image: albumImage || undefined,
          track_preview_url: state.selectedTrack.preview_url || undefined,
          track_external_url: externalUrl,
          track_duration: state.selectedTrack.duration_ms
            ? Math.floor(state.selectedTrack.duration_ms / 1000)
            : undefined, // Convert milliseconds to seconds
          caption: state.caption.trim() || undefined,
          feeling: state.feeling.trim() || undefined,
          is_currently_listening: false,
        });

        // Close modal (state will reset on next open)
        onPostCreated?.();
        onClose();
      } catch (error) {
        console.error("Failed to create post:", error);
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to create post",
        });
      }
    }
  };

  const submitError =
    state.error ||
    (createPostError instanceof Error ? createPostError.message : null) ||
    (updatePostError instanceof Error ? updatePostError.message : null);

  const renderContent = () => {
    const albumImage = state.selectedTrack
      ? getAlbumImage(state.selectedTrack, "medium")
      : null;
    const artistNames = state.selectedTrack
      ? state.selectedTrack.artists.map((a) => a.name).join(", ")
      : "";

    return (
      <div className={styles.postForm}>
        {/* Track Select - Using Field and Label pattern with Listbox */}
        {/* In edit mode, show track but disable selection */}
        {isEditMode ? (
          <Field>
            <Label className={styles.label}>
              <Text variant="caption" weight="medium">
                Track
              </Text>
            </Label>
            {state.selectedTrack && (
              <div className={styles.selectedTrack}>
                <div className={styles.trackImageContainer}>
                  {getAlbumImage(state.selectedTrack, "medium") ? (
                    <img
                      src={getAlbumImage(state.selectedTrack, "medium")!}
                      alt={state.selectedTrack.album.name}
                      className={styles.trackImage}
                    />
                  ) : (
                    <div className={styles.trackImagePlaceholder}>
                      <Music size={32} />
                    </div>
                  )}
                </div>
                <div className={styles.trackInfo}>
                  <Text variant="body" weight="semibold" as="div">
                    {state.selectedTrack.name}
                  </Text>
                  <Text variant="caption" color="muted" as="div">
                    {state.selectedTrack.artists.map((a) => a.name).join(", ")}
                  </Text>
                  <Text variant="caption" color="muted" as="div">
                    {state.selectedTrack.album.name}
                  </Text>
                </div>
              </div>
            )}
          </Field>
        ) : (
          <Field>
            <Label className={styles.label}>
              <Text variant="caption" weight="medium">
                Search Track
              </Text>
            </Label>

            <Combobox
              value={state.selectedTrack}
              onChange={handleTrackSelect}
              by={(a, b) => a?.id === b?.id}
              disabled={!isAuthenticated || !hasMusicServiceConnected}
            >
              <div className={styles.selectWrapper}>
                <div className={styles.selectButton}>
                  <Search size={20} className={styles.searchIcon} />

                  <ComboboxInput
                    ref={inputRef}
                    className={styles.searchInput}
                    placeholder={
                      hasMusicServiceConnected
                        ? "Search for a track..."
                        : "Connect to music provider to search"
                    }
                    displayValue={(t: SpotifyTrack | null) =>
                      t?.name ?? state.searchQuery
                    }
                    onChange={(e) => {
                      if (!hasMusicServiceConnected) return;
                      const value = e.target.value;
                      dispatch({ type: "SET_SEARCH_QUERY", payload: value });

                      // If a selection exists and user changes the text away from it — clear selection
                      if (
                        state.selectedTrack &&
                        value !== state.selectedTrack.name
                      ) {
                        dispatch({ type: "CLEAR_TRACK" });
                      }
                    }}
                    autoFocus
                    disabled={!hasMusicServiceConnected}
                  />

                  {state.selectedTrack && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSelection();
                        inputRef.current?.focus();
                      }}
                      className={styles.clearButtonInline}
                      aria-label="Clear selection"
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  )}

                  {state.searchQuery && state.selectedTrack === null && (
                    <ComboboxButton className={styles.listboxTriggerButton}>
                      {({ open }) => (
                        <ChevronDown
                          size={16}
                          className={`${styles.chevronIcon} ${
                            open ? styles.chevronOpen : ""
                          }`}
                        />
                      )}
                    </ComboboxButton>
                  )}
                </div>

                {/* Show message when authenticated but no music service is connected */}
                {isAuthenticated && !hasMusicServiceConnected && (
                  <div className={styles.musicServiceMessage}>
                    <AlertCircle size={16} />
                    <Text variant="caption" color="muted">
                      To be able to search music, please connect to a music
                      provider
                    </Text>
                  </div>
                )}

                <ComboboxOptions className={styles.selectOptions}>
                  {/* Loading */}
                  {state.searchQuery && isSearching && (
                    <div className={styles.searchState}>
                      <Loader2 className="animate-spin" size={20} />
                      <Text color="muted">Searching...</Text>
                    </div>
                  )}

                  {/* Error */}
                  {state.searchQuery && searchError && (
                    <div className={styles.searchState}>
                      <AlertCircle size={20} />
                      <Text color="muted">
                        {searchError instanceof Error
                          ? searchError.message
                          : "Failed to search"}
                      </Text>
                    </div>
                  )}

                  {/* No results */}
                  {state.searchQuery &&
                    !isSearching &&
                    !searchError &&
                    searchResults.length === 0 && (
                      <div className={styles.searchState}>
                        <Text color="muted">No tracks found</Text>
                      </div>
                    )}

                  {/* Results */}
                  {!isSearching &&
                    !searchError &&
                    searchResults.length > 0 &&
                    searchResults.map((track) => {
                      const trackAlbumImage = getAlbumImage(track, "small");
                      const trackArtistNames = track.artists
                        .map((a) => a.name)
                        .join(", ");

                      return (
                        <ComboboxOption
                          key={track.id}
                          value={track}
                          className={styles.selectOption}
                        >
                          {({ active, selected }) => (
                            <div
                              className={`${styles.trackOptionContent} ${
                                active ? styles.trackOptionFocused : ""
                              } ${selected ? styles.trackOptionSelected : ""}`}
                            >
                              {trackAlbumImage ? (
                                <img
                                  src={trackAlbumImage}
                                  alt={track.album.name}
                                  className={styles.trackOptionImage}
                                />
                              ) : (
                                <div
                                  className={styles.trackOptionImagePlaceholder}
                                >
                                  <Music size={16} />
                                </div>
                              )}

                              <div className={styles.trackOptionInfo}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Text variant="body" weight="medium" as="div">
                                    {track.name}
                                  </Text>
                                  {track.provider && (
                                    <PlatformIcon
                                      platform={track.provider}
                                      size={14}
                                      title={
                                        track.provider === "spotify"
                                          ? "Spotify"
                                          : "SoundCloud"
                                      }
                                    />
                                  )}
                                </div>
                                <Text variant="caption" color="muted" as="div">
                                  {trackArtistNames}
                                </Text>
                              </div>

                              {selected && (
                                <Check size={16} className={styles.checkIcon} />
                              )}
                            </div>
                          )}
                        </ComboboxOption>
                      );
                    })}
                </ComboboxOptions>
              </div>
            </Combobox>
          </Field>
        )}

        {/* Selected Track Display - Only in create mode */}
        {!isEditMode && state.selectedTrack && (
          <div className={styles.selectedTrack}>
            <div className={styles.trackImageContainer}>
              {albumImage ? (
                <img
                  src={albumImage}
                  alt={state.selectedTrack.album.name}
                  className={styles.trackImage}
                />
              ) : (
                <div className={styles.trackImagePlaceholder}>
                  <Music size={32} />
                </div>
              )}
            </div>
            <div className={styles.trackInfo}>
              <Text variant="body" weight="semibold" as="div">
                {state.selectedTrack.name}
              </Text>
              <Text variant="caption" color="muted" as="div">
                {artistNames}
              </Text>
              <Text variant="caption" color="muted" as="div">
                {state.selectedTrack.album.name}
              </Text>
            </div>
          </div>
        )}

        {/* Form Fields - Always Visible */}
        <div className={styles.formFields}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Text variant="caption" weight="medium">
                Feeling (optional)
              </Text>
            </label>
            <input
              type="text"
              placeholder="How does this make you feel? 🎵"
              value={state.feeling}
              onChange={(e) =>
                dispatch({ type: "SET_FEELING", payload: e.target.value })
              }
              className={styles.input}
              maxLength={50}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Text variant="caption" weight="medium">
                Caption (optional)
              </Text>
            </label>
            <textarea
              placeholder="Share your thoughts..."
              value={state.caption}
              onChange={(e) =>
                dispatch({ type: "SET_CAPTION", payload: e.target.value })
              }
              className={styles.textarea}
              rows={3}
              maxLength={500}
            />
            <Text variant="caption" color="muted" className={styles.charCount}>
              {state.caption.length}/500
            </Text>
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} />
            <Text variant="caption" color="error">
              {submitError}
            </Text>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting || (!isEditMode && !state.selectedTrack)}
            leftIcon={
              isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : undefined
            }
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Posting..."
              : isEditMode
              ? "Update"
              : "Post"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          isEditMode
            ? "Edit Post"
            : state.selectedTrack
            ? "Create Post"
            : "Share What You're Listening To"
        }
        size="md"
      >
        {!isAuthenticated ? (
          <div className={styles.authRequired}>
            <Music size={48} className={styles.authIcon} />
            <Text variant="body" weight="medium" className={styles.authTitle}>
              Connect Your Music
            </Text>
            <Text
              variant="caption"
              color="muted"
              className={styles.authMessage}
            >
              Connect your Spotify account to search for music and create posts
            </Text>
          </div>
        ) : (
          renderContent()
        )}
      </Modal>
    </>
  );
};
