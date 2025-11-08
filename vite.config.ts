import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
  server: {
    // Only use HTTPS in development if certs exist
    ...(process.env.NODE_ENV === "development" &&
    fs.existsSync(path.resolve(__dirname, "certs/localhost-key.pem")) &&
    fs.existsSync(path.resolve(__dirname, "certs/localhost-cert.pem"))
      ? {
          https: {
            key: fs.readFileSync(
              path.resolve(__dirname, "certs/localhost-key.pem")
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, "certs/localhost-cert.pem")
            ),
          },
        }
      : {}),
    port: 5173,
  },
});
