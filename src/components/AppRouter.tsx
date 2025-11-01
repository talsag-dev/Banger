import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "./Loading";
import { Landing } from "../pages/Landing";
import { SpotifyCallback } from "./SpotifyCallback";
import { AuthenticatedApp } from "./AuthenticatedApp";

export const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <Routes>
      {/* Auth callback routes - always available */}
      <Route path="/auth/success" element={<SpotifyCallback />} />
      <Route path="/auth/error" element={<SpotifyCallback />} />
      <Route path="/auth/spotify/callback" element={<SpotifyCallback />} />

      {/* Conditional routes based on authentication */}
      {isAuthenticated ? (
        // Authenticated user sees the main app
        <Route path="/*" element={<AuthenticatedApp />} />
      ) : (
        // Unauthenticated user sees the landing page
        <Route path="/*" element={<Landing />} />
      )}
    </Routes>
  );
};
