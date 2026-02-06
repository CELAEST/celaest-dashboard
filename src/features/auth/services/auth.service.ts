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
    } catch (error) {
      console.error("AuthService.login error:", error);
      throw error;
    }
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
  }
};
