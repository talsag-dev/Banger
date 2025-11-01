import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { Home } from "@pages/Home";
import { Profile } from "@pages/Profile";

export const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
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
