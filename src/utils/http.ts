export type HttpError = {
  status: number;
  error: string;
  message?: string;
  code?: string;
};

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:3001/api";

export async function http<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => ({})) : undefined;

  if (!res.ok) {
    const err: HttpError = {
      status: res.status,
      error: body?.error || res.statusText || "Request failed",
      message: body?.message,
      code: body?.code,
    };
    throw Object.assign(new Error(err.message || err.error), err);
  }

  // Support both {success,data} and plain JSON
  if (body && typeof body === "object" && "success" in body) {
    return (body.data as T) ?? (body as T);
  }
  return (body as T) ?? (undefined as unknown as T);
}
