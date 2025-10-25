import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

async function enableMocking() {
  // Check if mocking is enabled via environment variable
  const enableMocks = import.meta.env.VITE_ENABLE_MOCKS === "true";

  if (import.meta.env.MODE !== "development") {
    return;
  }

  if (!enableMocks) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass", // Let unhandled requests pass through to real API
  });
}
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
