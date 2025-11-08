import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useInvalidateSpotifyQueries } from "@hooks/useSpotify";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import styles from "./SpotifyCallback.module.css";
import { http } from "@utils/http";

export const OAuthCallback = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const { refreshProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const invalidateSpotify = useInvalidateSpotifyQueries();

  const handledRef = useRef(false);
  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const errParam = urlParams.get("error");
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (location.pathname === "/auth/error" || errParam) {
          setStatus("error");
          setMessage(getErrorMessage(errParam));
          return;
        }

        // Spotify
        if (location.pathname === "/auth/spotify/callback" && code) {
          setStatus("loading");
          setMessage("Connecting to Spotify...");

          try {
            await http(`/auth/integrations/spotify/connect`, {
              method: "POST",
              body: JSON.stringify({ code, state }),
            });

            setStatus("success");
            setMessage("Successfully connected to Spotify!");

            invalidateSpotify();
            // Refresh profile to get updated integration data
            await refreshProfile();
            // Small delay to show success message, then navigate
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1500);
            return;
          } catch (err) {
            setStatus("error");
            setMessage(
              err instanceof Error
                ? err.message
                : "Failed to connect to Spotify"
            );
            return;
          }
        }

        // SoundCloud (we use /auth/soundcloud)
        if (location.pathname === "/auth/soundcloud" && code && state) {
          setStatus("loading");
          setMessage("Connecting to SoundCloud...");

          try {
            await http(`/auth/integrations/soundcloud/connect`, {
              method: "POST",
              body: JSON.stringify({ code, state }),
            });

            // Connection succeeded - show success even if there were warnings
            setStatus("success");
            setMessage("Successfully connected to SoundCloud!");
            // Small delay to show success message, then navigate
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1500);
            return;
          } catch (err: unknown) {
            // Only show error if it's a real connection failure, not a 403 from /me
            const errorMessage =
              err instanceof Error
                ? err.message
                : "Failed to connect to SoundCloud";
            const errorStatus = (err as { status?: number })?.status;
            const isNotFound =
              errorStatus === 404 ||
              errorMessage.toLowerCase().includes("not found");

            // If it's a NOT_FOUND or 404, treat it as success (connection worked, profile fetch may have failed)
            if (isNotFound) {
              setStatus("success");
              setMessage("Successfully connected to SoundCloud!");
              setTimeout(() => {
                navigate("/", { replace: true });
              }, 1500);
              return;
            }

            setStatus("error");
            setMessage(errorMessage);
            return;
          }
        }

        if (location.pathname === "/auth/success") {
          setStatus("success");
          setMessage("Authentication success");
          // Small delay to show success message, then navigate
          // Profile will refresh naturally when the app loads
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
          return;
        }

        // If we get here, it's an unknown state - but don't show error immediately
        // Check if we're just missing code/state but might still be processing
        if (location.pathname === "/auth/soundcloud") {
          // Still on soundcloud route but no code/state - might be loading
          setStatus("loading");
          setMessage("Processing SoundCloud connection...");
          // Give it a moment, then navigate home (connection might have succeeded)
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 2000);
          return;
        }

        // Only show error for truly unknown states
        setStatus("error");
        setMessage("Unknown callback state");
      } catch {
        setStatus("error");
        setMessage("Failed to complete authentication");
      }
    };

    handleCallback();
  }, [refreshProfile, location, invalidateSpotify, navigate]);

  const getErrorMessage = (error: string | null): string => {
    switch (error) {
      case "access_denied":
        return "You denied access. Please try again if you want to connect.";
      case "invalid_client":
        return "Invalid application configuration.";
      case "invalid_grant":
        return "Authorization code expired. Please try again.";
      case "invalid_scope":
        return "Invalid permissions requested.";
      case "missing_params":
        return "Missing required parameters.";
      case "invalid_state":
        return "Security validation failed. Please try again.";
      case "auth_failed":
        return "Authentication process failed. Please try again.";
      case "auth_required":
        return "You need to be logged in to connect. Please log in first.";
      default:
        return error
          ? `Authentication failed: ${error}`
          : "Authentication failed.";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === "loading" && (
          <div>
            <div className={styles.spinner} />
            <Text variant="subtitle" className={styles.subtitle}>
              Connecting...
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
              <Button
                onClick={() => navigate("/", { replace: true })}
                size="md"
              >
                Return to App
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
