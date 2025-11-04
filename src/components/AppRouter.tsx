import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "./Loading";
import { Landing } from "../pages/Landing";
import { AuthenticatedApp } from "./AuthenticatedApp";
import { OAuthCallback } from "./OAuthCallback";

export const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <Routes>
      {/* Auth callback routes - always available */}
      <Route path="/auth/success" element={<OAuthCallback />} />
      <Route path="/auth/error" element={<OAuthCallback />} />
      <Route path="/auth/spotify/callback" element={<OAuthCallback />} />
      <Route path="/auth/soundcloud" element={<OAuthCallback />} />

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
