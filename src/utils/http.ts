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

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const body = options.body ? JSON.stringify(options.body) : null;

  // Debug logging for cookie issues (only in development or when explicitly enabled)
  if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === "true") {
    console.log(`🌐 Making request to: ${url}`, {
      credentials: "include",
      method: options.method || "GET",
    });
  }

  const res = await fetch(url, {
    credentials: "include",
    headers,
    ...options,
    body,
  });

  // Log if cookies might be missing (401 on auth endpoints)
  if (!res.ok && res.status === 401 && endpoint.includes("/auth/")) {
    console.warn(
      "⚠️ 401 Unauthorized - Cookie might not be sent. Check browser cookie settings and third-party cookie blocking."
    );
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
