/**
 * API Client global - celaest-back
 * baseURL, auth (JWT), multi-tenant (X-Organization-ID), manejo de errores
 * Las features extienden este cliente, no duplican lógica
 */

import { z } from "zod";
import { logger } from "./logger";

const BASE_URL = process.env.NEXT_PUBLIC_CELAEST_API_URL || "http://localhost:3001";

// Persistence-aware blacklist for revoked organizations.
// Using sessionStorage ensures that if a 403 occurs and triggers a reload, 
// the next instance of the app still knows that the Org ID is forbidden.
const getBlacklist = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = sessionStorage.getItem('celaest:revoked_orgs');
    return new Set(data ? JSON.parse(data) : []);
  } catch {
    return new Set();
  }
};

const saveToBlacklist = (orgId: string) => {
  if (typeof window === 'undefined') return;
  try {
    const list = getBlacklist();
    list.add(orgId);
    sessionStorage.setItem('celaest:revoked_orgs', JSON.stringify(Array.from(list)));
  } catch (e) {
    console.error("[api-client] Failed to save to blacklist:", e);
  }
};

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

type RequestConfig<T = unknown> = RequestInit & {
  params?: Record<string, string>;
  token?: string | null;
  orgId?: string | null;
  skipUnwrap?: boolean;
  schema?: z.ZodType<T>;
};

async function request<T>(
  path: string,
  config: RequestConfig<T> & ApiClientConfig = {}
): Promise<T> {
  const { params, token, orgId, skipUnwrap, ...init } = config;

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
    const blacklist = getBlacklist();
    if (blacklist.has(orgId)) {
      logger.error(`🚫 Request blocked: Organization ${orgId} is blacklisted for this session.`);
      throw new ApiError(
        "Acceso denegado: Workspace revocado",
        403,
        "FORBIDDEN"
      );
    }
    (headers as Record<string, string>)["X-Organization-ID"] = orgId;
  }

  const MAX_RETRIES = 2;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        ...init,
        headers,
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
        // Normalize flat error responses from middleware (e.g. rate limiter returns
        // { "error": "rate limit exceeded", "retry_after": 60 } instead of
        // { "error": { "message": "...", "code": "..." } }).
        if (typeof data.error === "string") {
          const raw = data as unknown as Record<string, unknown>;
          const retryAfter = typeof raw.retry_after === "number" ? raw.retry_after : null;
          const msg = retryAfter
            ? `Demasiados intentos. Espera ${retryAfter} segundos e intenta de nuevo.`
            : (data.error as string);
          data = { success: false, error: { message: msg } };
        }

        const errorData = (data.error || {}) as NonNullable<ApiResponse<T>["error"]>;
        
        if (response.status === 401) {
          const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/signup');
          if (typeof window !== "undefined" && !isAuthEndpoint) {
            logger.error("🚨 TRIGGERING 401 UNAUTHORIZED LOGOUT. FAILED URL:", url);
            window.dispatchEvent(new CustomEvent('celaest:unauthorized'));
          }
        }

        if (response.status === 403 && (errorData.code === "FORBIDDEN" && (errorData.message?.toLowerCase().includes("not a member") || errorData.message?.toLowerCase().includes("miembro")))) {
          if (typeof window !== "undefined") {
            const currentOrgId = (headers as Record<string, string>)["X-Organization-ID"];

            // NEVER blacklist the home/system org (Celaest).
            // If Celaest itself returns 403 due to a transient backend issue or a
            // stale JWT, blacklisting it creates an unrecoverable loop:
            //   request → 403 → blacklist Celaest → celaest:org_not_found → clearSync
            //   → redirect → fetchOrgs → Celaest is currentOrg again → request → 403 → ∞
            // The home org ID is written to sessionStorage by useOrgStore.fetchOrgs.
            const homeOrgId = sessionStorage.getItem('celaest:home_org_id');
            const isHomeOrg = currentOrgId && homeOrgId && currentOrgId === homeOrgId;

            const blacklist = getBlacklist();
            if (currentOrgId && !blacklist.has(currentOrgId) && !isHomeOrg) {
              saveToBlacklist(currentOrgId);
              logger.warn("🚨 MEMBERSHIP REVOKED (403). Redirection triggered for Org:", currentOrgId);
              window.dispatchEvent(new CustomEvent('celaest:org_not_found'));
            } else if (isHomeOrg) {
              logger.warn("⚠️ 403 on home org (Celaest) — NOT blacklisting. Backend may need a restart or token refresh.", currentOrgId);
            }
          }
        }

        if (response.status === 404 && errorData.message?.includes("Organization not found")) {
          // Only trigger nuclear recovery when the ORGANIZATION itself is missing,
          // NOT for other 404s like "Subscription not found", "Plan not found",
          // "License not found", etc. Those are normal app states (org has no plan),
          // not signs that the user was revoked. Triggering celaest:org_not_found
          // on those 404s was wiping currentOrg whenever a Juli org had no plan,
          // causing "Preparando sesión" for any user in a workspace without a paid tier.
          if (typeof window !== "undefined") {
            logger.warn("🚨 ORGANIZATION NOT FOUND (404). URL:", url);
            window.dispatchEvent(new CustomEvent('celaest:org_not_found'));
          }
        }
        
        throw new ApiError(
          errorData.message || "Request failed",
          response.status,
          errorData.code,
          errorData.details
        );
      }

      let responseData = (data.data !== undefined ? data.data : data) as T;

      if (config.schema) {
        try {
          responseData = config.schema.parse(responseData);
        } catch (err: unknown) {
          if (err instanceof z.ZodError) {
            logger.error(`🚨 [Zod ERROR] Path: ${path}`, JSON.stringify(err.issues, null, 2));
            throw new ApiError(
              "Respuesta inválida desde el servidor",
              500,
              "SCHEMA_MISMATCH",
              { issues: err.issues } as Record<string, unknown>
            );
          }
          throw err;
        }
      }

      if (skipUnwrap) {
        return data as unknown as T;
      }

      return responseData;
    } catch (error: unknown) {
      if (error instanceof ApiError) throw error;
      
      const isNetworkError = error instanceof TypeError || 
                             (error instanceof Error && (error.name === 'TypeError' || (error as { code?: string }).code === 'NETWORK_ERROR'));
      
      let errorMessage = error instanceof Error ? error.message : "Error de red desconocido";
      const isConnectionRefused = errorMessage === "Failed to fetch" || errorMessage.includes("ERR_CONNECTION_REFUSED");
      
      // Si el servidor está completamente apagado (Failed to fetch), no hacemos retry (evita spam 3x en consola browser)
      if (isNetworkError && attempt < MAX_RETRIES && !isConnectionRefused) {
        attempt++;
        const delay = 500 * Math.pow(2, attempt); // Exponential backoff: 1s, 2s
        console.warn(`[api-client] Retrying request (${attempt}/${MAX_RETRIES}) after network error. Delay: ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (errorMessage === "Failed to fetch") {
        errorMessage = `Error de conexión: El servidor no responde (${BASE_URL}). Asegúrese de que el backend esté ejecutándose.`;
      }

      // Devolvemos el error; Next.js no lo interceptará con Overlay rojo asumiendo que el que llama hace un catch.
      const apiError = new ApiError(errorMessage, 500, "NETWORK_ERROR");
      
      // Hacker alert: Ocultarle el stack a Turbopack para que no salte el error en pantalla
      // solo en caso de errores de RED puros.
      if (isConnectionRefused && typeof window !== 'undefined') {
         apiError.stack = "";
      }
      throw apiError;
    }
  }
  
  throw new ApiError("Maximum retries reached", 500, "NETWORK_ERROR");
}

export const api = {
  get: <T>(path: string, config?: RequestConfig<T> & ApiClientConfig) =>
    request<T>(path, { ...config, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    config?: RequestConfig<T> & ApiClientConfig
  ) =>
    request<T>(path, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(
    path: string,
    body?: unknown,
    config?: RequestConfig<T> & ApiClientConfig
  ) =>
    request<T>(path, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(
    path: string,
    body?: unknown,
    config?: RequestConfig<T> & ApiClientConfig
  ) =>
    request<T>(path, {
      ...config,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, config?: RequestConfig<T> & ApiClientConfig) =>
    request<T>(path, { ...config, method: "DELETE" }),
};

export default api;
