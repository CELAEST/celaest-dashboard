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

export const usersApi = {
  getUsers: async (page = 1, perPage = 20): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>("/org/users", {
      params: { page: String(page), per_page: String(perPage) },
    });
    return response;
  },

  updateRole: async (userId: string, role: string): Promise<void> => {
    await api.patch(`/org/users/${userId}`, { role });
  },

  signOut: async (userId: string): Promise<void> => {
    await api.post(`/user/sessions/revoke-all`, { user_id: userId });
  },
};
