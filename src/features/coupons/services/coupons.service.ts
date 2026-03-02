import { logger } from "@/lib/logger";
import { couponsApi } from "../api/coupons.api";
import { CreateCouponFormValues } from "../lib/validation";

export const couponsService = {
  /**
   * Obtiene todos los cupones
   */
  async getCoupons(token: string, orgId: string) {
    try {
      const response = await couponsApi.getCoupons(token, orgId);
      return response;
    } catch (error: unknown) {
      logger.error("CouponsService.getCoupons error:", error);
      throw error;
    }
  },

  /**
   * Obtiene detalles de un cupón
   */
  async getCouponByCode(code: string, token: string, orgId: string) {
    try {
      const response = await couponsApi.getCouponByCode(code, token, orgId);
      return response;
    } catch (error: unknown) {
      logger.error(`CouponsService.getCouponByCode (${code}) error:`, error);
      throw error;
    }
  },

  /**
   * Valida si un cupón es aplicable
   */
  async validateCoupon(code: string, token: string, orgId: string) {
    try {
      const response = await couponsApi.validateCoupon(code, token, orgId);
      return response;
    } catch (error: unknown) {
      logger.error(`CouponsService.validateCoupon (${code}) error:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo cupón
   */
  async createCoupon(data: CreateCouponFormValues, token: string, orgId: string) {
    try {
      // Transform datetime-local ("2026-02-23T12:28") to RFC3339 ("2026-02-23T12:28:00Z")
      // The backend expects time.RFC3339 format for parsing
      const payload = {
        ...data,
        expires_at: data.expires_at
          ? new Date(data.expires_at).toISOString()
          : null,
      };
      const response = await couponsApi.createCoupon(payload as CreateCouponFormValues, token, orgId);
      return response;
    } catch (error: unknown) {
      logger.error("CouponsService.createCoupon error:", error);
      throw error;
    }
  },

  /**
   * Desactiva / elimina un cupón existente
   */
  async deleteCoupon(code: string, token: string, orgId: string) {
    try {
      await couponsApi.deleteCoupon(code, token, orgId);
      return { success: true };
    } catch (error: unknown) {
      logger.error(`CouponsService.deleteCoupon (${code}) error:`, error);
      throw error;
    }
  },
};
