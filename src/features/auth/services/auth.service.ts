/**
 * Feature: Auth - Domain Service
 * Lógica de negocio y coordinación de la feature.
 */

import { authApi } from "../api/auth.api";
import { AuthResponse, UserProfile } from "../lib/types";

export const authService = {
  /**
   * Procesa el inicio de sesión
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await authApi.login(email, password);
      // Aquí se podrían añadir transformaciones o logs específicos
      return response;
    } catch (error: unknown) {
      throw error;
    }
  },

  async register(params: {
    email: string;
    password: string;
    name: string;
    locale?: string;
  }) {
    return authApi.register({
      ...params,
      email: params.email.trim().toLowerCase(),
      name: params.name.trim(),
    });
  },

  /**
   * Verifica si una sesión es válida con el backend
   */
  async verifySession(token: string) {
    return authApi.verifySession(token);
  },

  /**
   * Obtiene los datos del perfil actual
   */
  async getCurrentUser(token: string): Promise<UserProfile> {
    return authApi.getProfile(token);
  },

  /**
   * Obtiene organizaciones
   */
  async getUserOrganizations(token: string) {
    return authApi.getMyOrganizations(token);
  },

  async requestPasswordReset(email: string, locale = "es") {
    return authApi.forgotPassword(email.trim().toLowerCase(), locale);
  },

  async confirmPasswordReset(token: string, newPassword: string) {
    return authApi.resetPassword(token.trim(), newPassword);
  },

  async requestOTP(email: string, locale = "es") {
    return authApi.requestOTP(email.trim().toLowerCase(), locale);
  },

  async verifyOTP(params: {
    email?: string;
    code?: string;
    magicToken?: string;
    locale?: string;
  }): Promise<AuthResponse> {
    return authApi.verifyOTP({
      ...params,
      email: params.email?.trim().toLowerCase(),
      code: params.code?.trim(),
      magicToken: params.magicToken?.trim(),
    });
  },

  async emergencyLockout(token: string) {
    return authApi.emergencyLockout(token.trim());
  },
};
