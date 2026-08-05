const API_URL = process.env.NEXT_PUBLIC_API_URL! || "https://movie-review-backend-mm6x.onrender.com";

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  // 1. Format clean endpoint path
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // 2. Retrieve token from localStorage (client-side only)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cinehub_token")
      : null;

  // 3. Build headers with Bearer token
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Une erreur est survenue");
  }

  return data;
}