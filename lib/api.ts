const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ApiOptions = {
  method?: string;
  body?: unknown;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method ?? "GET",

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },

    body: options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
}