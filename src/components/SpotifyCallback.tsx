import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInvalidateSpotifyQueries } from "../hooks/useSpotify";

export const SpotifyCallback = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const invalidateSpotifyQueries = useInvalidateSpotifyQueries();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const error = urlParams.get("error");

        // Check if this is an error route or has error parameter
        if (location.pathname === "/auth/error" || error) {
          setStatus("error");
          setMessage(getErrorMessage(error));
          return;
        }

        // This is a success route
        if (location.pathname === "/auth/success") {
          setStatus("success");
          setMessage("Successfully connected to Spotify!");

          // Invalidate all Spotify queries to refetch with new auth
          invalidateSpotifyQueries();

          // Redirect back to home after a short delay
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
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
  }, [invalidateSpotifyQueries, location]);

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
      default:
        return error
          ? `Authentication failed: ${error}`
          : "Authentication failed for unknown reason.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {status === "loading" && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connecting to Spotify...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your authentication.
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting you back to the app...
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Return to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
