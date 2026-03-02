import { api } from "@/lib/api-client";
import { Coupon, CouponValidationResult } from "../lib/types";
import { CreateCouponFormValues } from "../lib/validation";

// Tipos base para respuestas
export interface CouponListResponse {
  success: boolean;
  data: Coupon[];
}

export interface CouponResponse {
  success: boolean;
  data: Coupon;
}

export const couponsApi = {
  /**
   * Obtiene todos los cupones de la organización actual
   */
  getCoupons: (token: string, orgId: string) =>
    api.get<Coupon[]>("/api/v1/org/coupons", { token, orgId }),

  /**
   * Obtiene un cupón específico por su código
   */
  getCouponByCode: (code: string, token: string, orgId: string) =>
    api.get<Coupon>(`/api/v1/org/coupons/${code}`, { token, orgId }),

  /**
   * Valida un cupón de forma segura
   */
  validateCoupon: (code: string, token: string, orgId: string) =>
    api.get<CouponValidationResult>(`/api/v1/org/coupons/${code}/validate`, { token, orgId }),

  /**
   * Crea un nuevo cupón
   */
  createCoupon: (data: CreateCouponFormValues, token: string, orgId: string) =>
    api.post<Coupon>("/api/v1/org/coupons", data, { token, orgId }),

  /**
   * Desactiva/elimina un cupón
   */
  deleteCoupon: (code: string, token: string, orgId: string) =>
    api.delete<void>(`/api/v1/org/coupons/${code}`, { token, orgId }),
};
