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

  forgotPassword: (email: string, locale = "es") =>
    api.post<{ message: string }>("/api/v1/auth/forgot-password", { email, locale }),

  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>("/api/v1/auth/reset-password", {
      token,
      new_password: newPassword,
    }),

  requestOTP: (email: string, locale = "es") =>
    api.post<{ message: string; expires_in: number }>("/api/v1/auth/otp/request", {
      email,
      locale,
    }),

  verifyOTP: (params: {
    email?: string;
    code?: string;
    magicToken?: string;
    locale?: string;
  }) =>
    api.post<AuthResponse>("/api/v1/auth/otp/verify", {
      email: params.email,
      code: params.code,
      magic_token: params.magicToken,
      locale: params.locale || "es",
    }),

  emergencyLockout: (token: string) =>
    api.post<{ message: string }>("/api/v1/auth/security/lockout", { token }),

  verifySession: (token: string) =>
    api.post<SessionVerification>("/api/v1/auth/verify", {}, { token }),

  getProfile: (token: string) =>
    api.get<UserProfile>("/api/v1/user/me", { token }),

  getMyOrganizations: (token: string) =>
    api.get<UserOrganizationsResponse>("/api/v1/user/organizations", { token }),
};
