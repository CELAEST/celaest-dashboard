/**
 * API Client global - celaest-back
 * baseURL, auth (JWT), multi-tenant (X-Organization-ID), manejo de errores
 * Las features extienden este cliente, no duplican lógica
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_CELAEST_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClientConfig {
  token?: string | null;
  orgId?: string | null;
}

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
  token?: string | null;
  orgId?: string | null;
};

async function request<T>(
  path: string,
  config: RequestConfig & ApiClientConfig = {}
): Promise<T> {
  const { params, token, orgId, ...init } = config;

  let url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  if (params) {
    const search = new URLSearchParams(params).toString();
    url += (url.includes("?") ? "&" : "?") + search;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  if (orgId) {
    (headers as Record<string, string>)["X-Organization-ID"] = orgId;
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: init.method === "GET" ? "no-store" : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = data?.error || {};
    throw new ApiError(
      err?.message || data?.error || "Request failed",
      response.status,
      err?.code
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, config?: RequestConfig & ApiClientConfig) =>
    request<T>(path, { ...config, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    config?: RequestConfig & ApiClientConfig
  ) =>
    request<T>(path, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(
    path: string,
    body?: unknown,
    config?: RequestConfig & ApiClientConfig
  ) =>
    request<T>(path, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, config?: RequestConfig & ApiClientConfig) =>
    request<T>(path, { ...config, method: "DELETE" }),
};
