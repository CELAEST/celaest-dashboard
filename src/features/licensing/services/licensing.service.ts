/**
 * Licensing Service
 * Wraps the API client with auth context and error handling
 */
import { licensingApi } from "../api/licensing.api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import type {
  LicenseFilter,
  CreateLicenseInput,
  UpdateLicenseInput,
  LicenseStatus,
} from "../types";

function getAuthContext() {
  const session = useAuthStore.getState().session;
  const org = useOrgStore.getState().currentOrg;
  const token = session?.accessToken;
  const orgId = org?.id;

  if (!token) throw new Error("Not authenticated");
  if (!orgId) throw new Error("No active organization");

  return { token, orgId };
}

/** Check if auth + org context is ready */
export function isServiceReady(): boolean {
  const session = useAuthStore.getState().session;
  const org = useOrgStore.getState().currentOrg;
  return !!(session?.accessToken && org?.id);
}

export const licensingService = {
  isServiceReady, // Export the function directly

  // ===== Plans =====

  list: async (filter: LicenseFilter = {}) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.list(filter, token, orgId);
  },

  getPlans: async () => {
    const { token, orgId } = getAuthContext();
    return licensingApi.getPlans(token, orgId);
  },

  getById: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.getById(id, token, orgId);
  },

  create: async (input: CreateLicenseInput) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.create(input, token, orgId);
  },

  update: async (id: string, input: UpdateLicenseInput) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.update(id, input, token, orgId);
  },

  delete: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.delete(id, token, orgId);
  },

  // ===== Stats =====

  getStats: async () => {
    const { token, orgId } = getAuthContext();
    return licensingApi.getStats(token, orgId);
  },

  // ===== Extended Operations =====

  renew: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.renew(id, token, orgId);
  },

  revoke: async (id: string, reason: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.revoke(id, reason, token, orgId);
  },

  reactivate: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.reactivate(id, token, orgId);
  },

  convertTrial: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.convertTrial(id, token, orgId);
  },

  // ===== Usage & Limits =====

  getUsage: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.getUsage(id, token, orgId);
  },

  checkLimits: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.checkLimits(id, token, orgId);
  },

  // ===== IP/Activation Management =====

  getActivations: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.getActivations(id, token, orgId);
  },

  bindIP: async (
    id: string,
    data: { ip_address: string; hostname?: string; user_agent?: string }
  ) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.bindIP(id, data, token, orgId);
  },

  unbindIP: async (id: string, ipAddress: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.unbindIP(id, ipAddress, token, orgId);
  },

  // ===== Security & Auditing =====

  getCollisions: async (id: string) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.getCollisions(id, token, orgId);
  },

  getValidations: async (id: string, limit = 50) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.getValidations(id, token, orgId, limit);
  },

  // ===== Convenience Methods =====

  changeStatus: async (id: string, status: LicenseStatus) => {
    const { token, orgId } = getAuthContext();
    return licensingApi.update(id, { status }, token, orgId);
  },
};
