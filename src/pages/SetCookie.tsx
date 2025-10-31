import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function getQueryParam(name: string, search: string) {
  const params = new URLSearchParams(search);
  return params.get(name);
}

export default function SetCookie() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get token from localStorage or query param
    let token = localStorage.getItem("auth_token");
    if (!token) {
      token = getQueryParam("token", location.search);
    }
    const next = getQueryParam("next", location.search) || "/";

    if (token) {
      // Set cookie for ngrok domain
      document.cookie = `auth_token=${token}; domain=.ngrok-free.dev; path=/; secure; samesite=None`;
    }
    // Redirect to next page
    navigate(next, { replace: true });
  }, [location, navigate]);

  return <div>Setting authentication cookie...</div>;
}
