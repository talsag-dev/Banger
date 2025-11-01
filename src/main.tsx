import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

async function enableMocking() {
  const enableMocks = import.meta.env.VITE_ENABLE_MOCKS === "true";

  if (import.meta.env.MODE !== "development") {
    return;
  }

  if (!enableMocks) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
