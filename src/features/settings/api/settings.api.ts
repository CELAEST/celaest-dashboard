import { api } from "@/lib/api-client";
import { UserData } from "@/features/users/components/types";

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
    return await api.get<UserData>("/api/v1/user/me", { token });
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
};
