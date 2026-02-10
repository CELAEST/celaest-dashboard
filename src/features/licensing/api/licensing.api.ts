/**
 * Licensing API Client
 * Follows the same pattern as marketplace.api.ts
 */
import { api } from "@/lib/api-client";
import type {
  LicenseListResponse,
  LicenseResponse,
  LicenseStats,
  CreateLicenseInput,
  UpdateLicenseInput,
  LicenseFilter,
  IPBinding,
  CollisionData,
  LimitsStatus,
  SubscriptionPlan,
} from "../types";

export const licensingApi = {
  // ===== Plans =====

  getPlans: async (token: string, orgId: string) => {
    return api.get<{ plans: SubscriptionPlan[]; total: number }>(
      "/api/v1/org/plans",
      {
        params: { active_only: "true" },
        token,
        orgId,
      }
    );
  },

  // ===== CRUD =====

  list: async (filter: LicenseFilter, token: string, orgId: string) => {
    const params: Record<string, string> = {};
    if (filter.status) params.status = filter.status;
    if (filter.billing_cycle) params.billing_cycle = filter.billing_cycle;
    if (filter.plan_id) params.plan_id = filter.plan_id;
    if (filter.page) params.page = filter.page.toString();
    if (filter.limit) params.limit = filter.limit.toString();

    return api.get<LicenseListResponse>("/api/v1/org/licenses", {
      params,
      token,
      orgId,
    });
  },

  getById: async (id: string, token: string, orgId: string) => {
    return api.get<LicenseResponse>(`/api/v1/org/licenses/${id}`, {
      token,
      orgId,
    });
  },

  create: async (
    input: CreateLicenseInput,
    token: string,
    orgId: string
  ) => {
    return api.post<LicenseResponse>("/api/v1/org/licenses", input, {
      token,
      orgId,
    });
  },

  update: async (
    id: string,
    input: UpdateLicenseInput,
    token: string,
    orgId: string
  ) => {
    return api.put<LicenseResponse>(`/api/v1/org/licenses/${id}`, input, {
      token,
      orgId,
    });
  },

  delete: async (id: string, token: string, orgId: string) => {
    return api.delete<void>(`/api/v1/org/licenses/${id}`, { token, orgId });
  },

  // ===== Stats =====

  getStats: async (token: string, orgId: string) => {
    return api.get<LicenseStats>("/api/v1/org/licenses/stats", {
      token,
      orgId,
    });
  },

  // ===== Extended Operations =====

  renew: async (id: string, token: string, orgId: string) => {
    return api.post<LicenseResponse>(
      `/api/v1/org/licenses/${id}/renew`,
      {},
      { token, orgId }
    );
  },

  revoke: async (
    id: string,
    reason: string,
    token: string,
    orgId: string
  ) => {
    return api.post<LicenseResponse>(
      `/api/v1/org/licenses/${id}/revoke`,
      { reason },
      { token, orgId }
    );
  },

  reactivate: async (id: string, token: string, orgId: string) => {
    return api.post<LicenseResponse>(
      `/api/v1/org/licenses/${id}/reactivate`,
      {},
      { token, orgId }
    );
  },

  convertTrial: async (id: string, token: string, orgId: string) => {
    return api.post<LicenseResponse>(
      `/api/v1/org/licenses/${id}/convert-trial`,
      {},
      { token, orgId }
    );
  },

  // ===== Usage & Limits =====

  getUsage: async (id: string, token: string, orgId: string) => {
    return api.get<{ usage: Record<string, unknown>; limits: LimitsStatus }>(
      `/api/v1/org/licenses/${id}/usage`,
      { token, orgId }
    );
  },

  checkLimits: async (id: string, token: string, orgId: string) => {
    return api.get<LimitsStatus>(`/api/v1/org/licenses/${id}/limits`, {
      token,
      orgId,
    });
  },

  // ===== IP/Activation Management =====

  getActivations: async (id: string, token: string, orgId: string) => {
    return api.get<IPBinding[]>(`/api/v1/org/licenses/${id}/activations`, {
      token,
      orgId,
    });
  },

  bindIP: async (
    id: string,
    data: { ip_address: string; hostname?: string; user_agent?: string },
    token: string,
    orgId: string
  ) => {
    return api.post<ValidationResult>(
      `/api/v1/org/licenses/${id}/bind`,
      data,
      { token, orgId }
    );
  },

  unbindIP: async (
    id: string,
    ipAddress: string,
    token: string,
    orgId: string
  ) => {
    return api.delete<void>(
      `/api/v1/org/licenses/${id}/unbind?ip_address=${encodeURIComponent(ipAddress)}`,
      { token, orgId }
    );
  },

  // ===== Security & Auditing =====

  getCollisions: async (id: string, token: string, orgId: string) => {
    return api.get<CollisionData>(
      `/api/v1/org/licenses/${id}/collisions`,
      { token, orgId }
    );
  },

  getValidations: async (
    id: string,
    token: string,
    orgId: string,
    limit = 50
  ) => {
    return api.get<{ validations: IPBinding[]; total: number }>(
      `/api/v1/org/licenses/${id}/validations`,
      { params: { limit: limit.toString() }, token, orgId }
    );
  },
};

// Re-export ValidationResult for bindIP
import type { ValidationResult } from "../types";
