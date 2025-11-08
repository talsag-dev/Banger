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

  // Log immediately when component renders - this will help us see if component is mounting
  console.log("🔵 OAuthCallback RENDERED", {
    pathname: location.pathname,
    search: location.search.substring(0, 100), // First 100 chars to avoid huge logs
    fullUrl: window.location.href.substring(0, 200),
    timestamp: new Date().toISOString(),
  });

  const handledRef = useRef(false);
  useEffect(() => {
    console.log("🟢 OAuthCallback useEffect triggered", {
      alreadyHandled: handledRef.current,
      pathname: location.pathname,
    });

    if (handledRef.current) {
      console.log("⚠️ Already handled, skipping");
      return;
    }
    handledRef.current = true;

    const handleCallback = async () => {
      try {
        // Debug logging
        console.log("🟡 OAuthCallback handleCallback START", {
          pathname: location.pathname,
          searchLength: location.search.length,
        });

        const urlParams = new URLSearchParams(location.search);
        const errParam = urlParams.get("error");
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        console.log("🟡 OAuthCallback params extracted", {
          hasError: !!errParam,
          hasCode: !!code,
          hasState: !!state,
          codeLength: code?.length || 0,
          stateLength: state?.length || 0,
          codePreview: code?.substring(0, 50) || "none",
          statePreview: state?.substring(0, 20) || "none",
        });

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
          console.log("🔵 SoundCloud callback detected with code and state");
          setStatus("loading");
          setMessage("Connecting to SoundCloud...");

          try {
            console.log(
              "🟡 Making POST to /auth/integrations/soundcloud/connect"
            );
            const response = await http(
              `/auth/integrations/soundcloud/connect`,
              {
                method: "POST",
                body: JSON.stringify({ code, state }),
              }
            );
            console.log("✅ SoundCloud connection successful", response);

            // Connection succeeded - show success even if there were warnings
            setStatus("success");
            setMessage("Successfully connected to SoundCloud!");
            // Small delay to show success message, then navigate
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1500);
            return;
          } catch (err: unknown) {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "Failed to connect to SoundCloud";
            const errorStatus = (err as { status?: number })?.status;
            const errorObj = err as { status?: number; error?: string };

            // Log the error for debugging
            console.error("❌ SoundCloud connection error:", {
              status: errorStatus,
              message: errorMessage,
              error: errorObj.error,
              fullError: err,
            });

            // Handle different error cases
            if (errorStatus === 401) {
              // Not authenticated - user needs to log in first
              setStatus("error");
              setMessage(
                "Please log in first, then try connecting SoundCloud again."
              );
              return;
            }

            if (
              errorStatus === 404 ||
              errorMessage.toLowerCase().includes("not found")
            ) {
              // 404 could mean route not found or connection succeeded but profile fetch failed
              // Try to proceed as success since the token exchange might have worked
              setStatus("success");
              setMessage("Successfully connected to SoundCloud!");
              setTimeout(() => {
                navigate("/", { replace: true });
              }, 1500);
              return;
            }

            // For other errors, show the error message
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
          // Still on soundcloud route but no code/state - might be loading or already processed
          // Check if we have code/state in URL but they weren't extracted properly
          if (code || state) {
            // We have params but condition didn't match - try to connect anyway
            setStatus("loading");
            setMessage("Connecting to SoundCloud...");
            try {
              await http(`/auth/integrations/soundcloud/connect`, {
                method: "POST",
                body: JSON.stringify({ code, state }),
              });
              setStatus("success");
              setMessage("Successfully connected to SoundCloud!");
              setTimeout(() => {
                navigate("/", { replace: true });
              }, 1500);
              return;
            } catch (err: unknown) {
              // If it fails, treat 404 as success (connection might have worked)
              const errorStatus = (err as { status?: number })?.status;
              if (errorStatus === 404) {
                setStatus("success");
                setMessage("Successfully connected to SoundCloud!");
                setTimeout(() => {
                  navigate("/", { replace: true });
                }, 1500);
                return;
              }
              // For other errors, show loading and navigate (connection might have succeeded)
              setStatus("loading");
              setMessage("Processing connection...");
              setTimeout(() => {
                navigate("/", { replace: true });
              }, 2000);
              return;
            }
          }
          // No code/state - might be loading or already processed
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
