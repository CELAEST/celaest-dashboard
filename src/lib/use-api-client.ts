/**
 * use-api-client hook
 * Proporciona una instancia del cliente api que inyecta automáticamente 
 * el token (JWT) y el orgId (X-Organization-ID) actuales.
 */

import { useMemo } from "react";
import { api, ApiClientConfig } from "./api-client";
import { useApiAuth } from "./use-api-auth";

// Tipos para las opciones de las peticiones, extendiendo el estándar de fetch
type RequestOptions = Omit<RequestInit, "method" | "body"> & {
  params?: Record<string, string>;
};

export function useApiClient() {
  const { token, orgId } = useApiAuth();

  return useMemo(() => {
    const config: ApiClientConfig = { token, orgId };

    return {
      get: <T>(path: string, options?: RequestOptions) => 
        api.get<T>(path, { ...config, ...options }),
        
      post: <T>(path: string, body?: unknown, options?: RequestOptions) => 
        api.post<T>(path, body, { ...config, ...options }),
        
      put: <T>(path: string, body?: unknown, options?: RequestOptions) => 
        api.put<T>(path, body, { ...config, ...options }),
        
      delete: <T>(path: string, options?: RequestOptions) => 
        api.delete<T>(path, { ...config, ...options }),
    };
  }, [token, orgId]);
}

