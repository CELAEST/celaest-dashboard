import { api } from "@/lib/api-client";
import { HealthResponse } from "@/features/control-center/types";

export const systemApi = {
  /**
   * Obtiene el estado técnico global del sistema (Database, Redis, API)
   */
  getHealth: () => api.get<HealthResponse>("/health"),
};
