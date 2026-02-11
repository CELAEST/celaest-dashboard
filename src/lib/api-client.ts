/**
 * API Client global - celaest-back
 * baseURL, auth (JWT), multi-tenant (X-Organization-ID), manejo de errores
 * Las features extienden este cliente, no duplican lógica
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_CELAEST_API_URL || "https://celaest-back.onrender.com";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClientConfig {
  token?: string | null;
  orgId?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
  token?: string | null;
  orgId?: string | null;
  skipUnwrap?: boolean;
};

// Map para deduplicar peticiones en vuelo
const pendingRequests = new Map<string, Promise<unknown>>();

async function request<T>(
  path: string,
  config: RequestConfig & ApiClientConfig = {}
): Promise<T> {
  const { params, token, orgId, skipUnwrap, ...init } = config;

  // Solo deduplicamos peticiones GET
  const isGet = init.method === "GET" || !init.method;
  const cacheKey = isGet ? `${path}:${JSON.stringify(params)}:${token}:${orgId}` : null;

  if (cacheKey && pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  const promise = (async () => {
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

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        cache: init.method === "GET" ? "no-store" : undefined,
      });

      const text = await response.text();
      let data: ApiResponse<T>;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { 
          success: false, 
          error: { message: "Error al procesar la respuesta del servidor" } 
        };
      }

      if (!response.ok) {
        const errorData = (data.error || {}) as NonNullable<ApiResponse<T>["error"]>;
        throw new ApiError(
          errorData.message || "Request failed",
          response.status,
          errorData.code,
          errorData.details
        );
      }

      if (skipUnwrap) {
        return data as unknown as T;
      }

      return (data.data !== undefined ? data.data : data) as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : "Error de red desconocido",
        500,
        "NETWORK_ERROR"
      );
    } finally {
      if (cacheKey) pendingRequests.delete(cacheKey);
    }
  })();

  if (cacheKey) {
    pendingRequests.set(cacheKey, promise);
  }

  return promise;
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

  patch: <T>(
    path: string,
    body?: unknown,
    config?: RequestConfig & ApiClientConfig
  ) =>
    request<T>(path, {
      ...config,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, config?: RequestConfig & ApiClientConfig) =>
    request<T>(path, { ...config, method: "DELETE" }),
};

export default api;
