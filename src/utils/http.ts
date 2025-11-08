export type HttpError = {
  status: number;
  error: string;
  message?: string;
  code?: string;
};

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:3001/api";

export interface HttpOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | object | null;
}

export async function http<T>(
  endpoint: string,
  options: HttpOptions = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  // Get token from localStorage as fallback for cross-domain cookie issues
  const token = localStorage.getItem("auth_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const body = options.body ? JSON.stringify(options.body) : null;

  const res = await fetch(url, {
    credentials: "include",
    headers,
    ...options,
    body,
  });

  // If 401, clear invalid token from localStorage
  if (!res.ok && res.status === 401) {
    localStorage.removeItem("auth_token");
    if (endpoint.includes("/auth/")) {
      console.warn(
        "⚠️ 401 Unauthorized - Authentication failed. Token cleared."
      );
    }
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const responseBody = isJson ? await res.json().catch(() => ({})) : undefined;

  if (!res.ok) {
    const err: HttpError = {
      status: res.status,
      error: responseBody?.error || res.statusText || "Request failed",
      message: responseBody?.message,
      code: responseBody?.code,
    };
    throw Object.assign(new Error(err.message || err.error), err);
  }

  // Support both {success,data} and plain JSON
  if (
    responseBody &&
    typeof responseBody === "object" &&
    "success" in responseBody
  ) {
    return (responseBody.data as T) ?? (responseBody as T);
  }
  return (responseBody as T) ?? (undefined as unknown as T);
}
