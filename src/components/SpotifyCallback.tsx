import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useInvalidateSpotifyQueries } from "@hooks/useSpotify";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import styles from "./SpotifyCallback.module.css";
import { http } from "@utils/http";

export const SpotifyCallback = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const { refreshProfile } = useAuth();
  const location = useLocation();
  const invalidateSpotify = useInvalidateSpotifyQueries();

  const handledRef = useRef(false);
  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const error = urlParams.get("error");
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (location.pathname === "/auth/error" || error) {
          setStatus("error");
          setMessage(getErrorMessage(error));
          return;
        }

        if (location.pathname === "/auth/spotify/callback" && code) {
          setStatus("loading");
          setMessage("Connecting to Spotify...");

          try {
            // Send the authorization code to your backend
            await http(`/auth/integrations/spotify/connect`, {
              method: "POST",
              body: JSON.stringify({ code, state }),
            });

            setStatus("success");
            setMessage("Successfully connected to Spotify!");

            // Invalidate cached spotify queries, then redirect home
            invalidateSpotify();
            // Redirect back to home; main app will refresh profile once on mount
            window.location.replace("/");
            return;
          } catch (error) {
            console.error("Spotify connection error:", error);
            setStatus("error");
            setMessage(
              error instanceof Error
                ? error.message
                : "Failed to connect to Spotify"
            );
            return;
          }
        }

        // This is a success route
        if (location.pathname === "/auth/success") {
          setStatus("success");
          setMessage("Successfully connected to Spotify!");

          // Invalidate cached spotify queries, then redirect home
          invalidateSpotify();
          // Redirect back to home; main app will refresh profile once on mount
          window.location.replace("/");
          return;
        }

        // Fallback for unknown routes
        setStatus("error");
        setMessage("Unknown callback state");
      } catch (error) {
        console.error("Callback handling error:", error);
        setStatus("error");
        setMessage("Failed to complete authentication");
      }
    };

    handleCallback();
  }, [refreshProfile, location]);

  const getErrorMessage = (error: string | null): string => {
    switch (error) {
      case "access_denied":
        return "You denied access to Spotify. Please try again if you want to connect.";
      case "invalid_client":
        return "Invalid Spotify application configuration.";
      case "invalid_grant":
        return "Authorization code expired. Please try again.";
      case "invalid_scope":
        return "Invalid permissions requested.";
      case "missing_params":
        return "Missing required parameters from Spotify.";
      case "invalid_state":
        return "Security validation failed. Please try again.";
      case "auth_failed":
        return "Authentication process failed. Please try again.";
      case "user_not_found":
        return "User authentication failed. Please log in again and try connecting to Spotify.";
      case "auth_required":
        return "You need to be logged in to connect Spotify. Please log in first.";
      default:
        return error
          ? `Authentication failed: ${error}`
          : "Authentication failed for unknown reason.";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === "loading" && (
          <div>
            <div className={styles.spinner} />
            <Text variant="subtitle" className={styles.subtitle}>
              Connecting to Spotify...
            </Text>
            <Text variant="body" color="secondary" className={styles.bodyText}>
              Please wait while we complete your authentication.
            </Text>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className={`${styles.iconCircle} ${styles.iconSuccess}`}>
              ✓
            </div>
            <Text variant="subtitle" className={styles.subtitle}>
              Success!
            </Text>
            <Text variant="body" color="secondary" className={styles.bodyText}>
              {message}
            </Text>
            <Text
              variant="caption"
              color="secondary"
              className={styles.bodyText}
            >
              Redirecting you back to the app...
            </Text>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className={`${styles.iconCircle} ${styles.iconError}`}>✕</div>
            <Text variant="subtitle" className={styles.subtitle}>
              Authentication Failed
            </Text>
            <Text variant="body" color="secondary" className={styles.bodyText}>
              {message}
            </Text>
            <div className={styles.returnButton}>
              <Button onClick={() => (window.location.href = "/")} size="md">
                Return to App
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
