import { api } from "@/lib/api-client";
import { UserData } from "../components/types";

export interface UsersResponse {
  success: boolean;
  data: UserData[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface CreateUserInput {
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  role?: string;
  organization_id?: string;
}

export interface WorkspaceInvitation {
  id: string;
  organization_id: string;
  organization_name: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "rejected";
  invited_by: string;
  created_at: string;
  responded_at?: string;
}

export const usersApi = {
  getUsers: async (page = 1, perPage = 20, token: string, orgId: string): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>("/api/v1/org/users", {
      params: { page: String(page), per_page: String(perPage) },
      token,
      orgId,
      skipUnwrap: true,
    });
    return response;
  },

  createUser: async (data: CreateUserInput, token: string, orgId: string): Promise<UserData> => {
    const response = await api.post<UserData>("/api/v1/org/users", data, { token, orgId });
    return response;
  },

  listWorkspaceInvitations: async (token: string): Promise<{ invitations: WorkspaceInvitation[]; total: number }> => {
    return api.get<{ invitations: WorkspaceInvitation[]; total: number }>("/api/v1/user/workspace-invitations", { token });
  },

  acceptWorkspaceInvitation: async (invitationId: string, token: string): Promise<{ invitation: WorkspaceInvitation }> => {
    return api.post<{ invitation: WorkspaceInvitation }>(`/api/v1/user/workspace-invitations/${invitationId}/accept`, {}, { token });
  },

  rejectWorkspaceInvitation: async (invitationId: string, token: string): Promise<{ invitation: WorkspaceInvitation }> => {
    return api.post<{ invitation: WorkspaceInvitation }>(`/api/v1/user/workspace-invitations/${invitationId}/reject`, {}, { token });
  },

  updateUser: async (userId: string, data: UpdateUserInput, token: string, orgId: string): Promise<void> => {
    await api.put(`/api/v1/org/users/${userId}`, data, { token, orgId });
  },

  updateMe: async (data: UpdateUserInput, token: string): Promise<UserData> => {
    const response = await api.put<UserData>("/api/v1/user/me", data, { token });
    return response;
  },

  deleteUser: async (userId: string, token: string, orgId: string): Promise<void> => {
    // We use the organizations endpoint to safely remove the member from the workspace 
    // instead of deleting the entire user account.
    await api.delete(`/api/v1/org/organizations/${orgId}/members/${userId}`, { token, orgId });
  },

  // Alias for legacy support or convenience
  updateRole: async (userId: string, role: string, token: string, orgId: string): Promise<void> => {
    await api.put(`/api/v1/org/users/${userId}`, { role }, { token, orgId });
  },

  signOut: async (_userId: string, token: string): Promise<void> => {
    await api.delete("/api/v1/user/sessions", { token });
  },
};
