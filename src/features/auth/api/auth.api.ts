/**
 * Feature: Auth - Raw API Calls
 * Solo transporte y tipado.
 */

import { api } from "@/lib/api-client";
import { 
  AuthResponse, 
  SessionVerification, 
  UserProfile, 
  UserOrganizationsResponse 
} from "../lib/types";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/api/v1/auth/login", { email, password }),

  verifySession: (token: string) => 
    api.post<SessionVerification>("/api/v1/auth/verify", {}, { token }),


  getProfile: (token: string) => 
    api.get<UserProfile>("/api/v1/user/me", { token }),

  getMyOrganizations: (token: string) =>
    api.get<UserOrganizationsResponse>("/api/v1/user/organizations", { token }),
};
