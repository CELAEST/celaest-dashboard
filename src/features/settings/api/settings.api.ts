import { api } from "@/lib/api-client";
import { UserData, userDataSchema } from "@/features/users/components/types";

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret: string;
  created_at: string;
}

export interface PreferencesResponse {
  preferences: {
    raw: string | null;
    theme: string;
    language: string;
    timezone: string;
    notifications: boolean;
  };
}

export const settingsApi = {
  getMe: async (token: string): Promise<UserData> => {
    return await api.get<UserData>("/api/v1/user/me", { token, schema: userDataSchema });
  },

  updateMe: async (data: Partial<UserData>, token: string): Promise<UserData> => {
    return await api.put<UserData>("/api/v1/user/me", data, { token });
  },

  updateOrganization: async (orgId: string, data: { name: string; slug: string }, token: string): Promise<void> => {
    await api.put(`/api/v1/user/organizations/${orgId}`, data, { token });
  },

  getPreferences: async (token: string): Promise<PreferencesResponse> => {
    return await api.get<PreferencesResponse>("/api/v1/user/preferences", { token });
  },

  updatePreferences: async (preferences: Record<string, unknown>, token: string): Promise<Record<string, unknown>> => {
    return await api.put<Record<string, unknown>>("/api/v1/user/preferences", preferences, { token });
  },

  changeEmail: async (email: string, token: string): Promise<{ message: string }> => {
    return await api.put<{ message: string }>("/api/v1/user/auth/email", { email }, { token });
  },

  unlinkProvider: async (provider: string, token: string): Promise<{ message: string }> => {
    return await api.post<{ message: string }>(`/api/v1/user/auth/unlink/${provider}`, {}, { token });
  },

  getNotificationPreferences: async (token: string): Promise<{ notifications: string }> => {
    return await api.get<{ notifications: string }>("/api/v1/user/notifications", { token });
  },

  updateNotificationPreferences: async (notifications: Record<string, boolean>, token: string): Promise<{ message: string }> => {
    return await api.put<{ message: string }>("/api/v1/user/notifications", notifications, { token });
  },

  getWebhooks: async (token: string, orgId: string): Promise<Webhook[]> => {
    const response = await api.get<{ webhooks: Webhook[]; total: number }>("/api/v1/org/webhooks", { token, orgId });
    return response.webhooks || [];
  },

  createWebhook: async (token: string, orgId: string, data: Partial<Webhook>): Promise<Webhook> => {
    return await api.post<Webhook>("/api/v1/org/webhooks", data, { token, orgId });
  },

  deleteWebhook: async (token: string, orgId: string, id: string): Promise<void> => {
    return await api.delete(`/api/v1/org/webhooks/${id}`, { token, orgId });
  },
};
