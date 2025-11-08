import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { Home } from "@pages/Home";
import { Profile } from "@pages/Profile";
import { OAuthCallback } from "./OAuthCallback";

export const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
      {/* Auth callback routes - must be here too for authenticated users */}
      <Route path="/auth/success" element={<OAuthCallback />} />
      <Route path="/auth/error" element={<OAuthCallback />} />
      <Route path="/auth/spotify/callback" element={<OAuthCallback />} />
      <Route path="/auth/soundcloud" element={<OAuthCallback />} />

      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
    </Routes>
  );
};
