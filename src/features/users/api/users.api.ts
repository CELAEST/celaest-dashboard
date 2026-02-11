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

  updateUser: async (userId: string, data: UpdateUserInput, token: string, orgId: string): Promise<void> => {
    await api.put(`/api/v1/org/users/${userId}`, data, { token, orgId });
  },

  deleteUser: async (userId: string, token: string, orgId: string): Promise<void> => {
    await api.delete(`/api/v1/org/users/${userId}`, { token, orgId });
  },

  // Alias for legacy support or convenience
  updateRole: async (userId: string, role: string, token: string, orgId: string): Promise<void> => {
    await api.put(`/api/v1/org/users/${userId}`, { role }, { token, orgId });
  },

  signOut: async (userId: string, token: string): Promise<void> => {
    await api.post(`/api/v1/user/sessions/revoke-all`, { user_id: userId }, { token }); 
    // Note: This endpoint is usually user-centric, so orgId might not be strictly required by middleware if it's in a /user group, 
    // but the implementation above uses /user/sessions/revoke-all which is likely in jwtGroup (no org required).
  },
};
