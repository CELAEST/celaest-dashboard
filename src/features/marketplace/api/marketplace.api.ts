import { api } from "@/lib/api-client";
import { 
  MarketplaceProduct, 
  Review, 
  AdminReview,
  AdminReviewFilter,
  AdminReviewListResponse,
  ReviewListResponse,
  SellerProfile, 
  SearchFilter, 
  CreateReviewInput,
  UpdateReviewInput,
  UpdateReviewStatusInput,
  ProductSearchResponse,
  CheckoutResponse,
  ReviewStatus
} from "../types";

import { z } from "zod";

const productSearchSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    base_price: z.number()
  }).passthrough()).nullable().transform(v => v || []).catch([]),
  total: z.number()
}).passthrough() as unknown as z.ZodType<ProductSearchResponse>;

export const marketplaceApi = {
  /**
   * Buscar productos en el marketplace global
   */
  search: async (filter: SearchFilter) => {
    const params: Record<string, string> = {};
    if (filter.q) params.q = filter.q;
    if (filter.category) params.category = filter.category;
    if (filter.min_price) params.min_price = filter.min_price.toString();
    if (filter.max_price) params.max_price = filter.max_price.toString();
    if (filter.sort) params.sort = filter.sort;
    if (filter.page) params.page = filter.page.toString();
    if (filter.limit) params.limit = filter.limit.toString();

    return api.get<ProductSearchResponse>("/api/v1/public/marketplace/search", { params, schema: productSearchSchema });
  },

  /**
   * Obtener detalle de un producto por su slug
   */
  getBySlug: async (slug: string) => {
    return api.get<{ product: MarketplaceProduct, reviews: Review[] }>(
      `/api/v1/public/marketplace/products/${slug}`
    );
  },

  /**
   * Obtener perfil público de un vendedor
   */
  getSellerProfile: async (sellerId: string) => {
    return api.get<SellerProfile>(`/api/v1/public/marketplace/sellers/${sellerId}`);
  },

  /**
   * Listar reviews paginadas de un producto (público)
   */
  listReviews: async (
    productId: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    return api.get<ReviewListResponse>(
      `/api/v1/public/marketplace/products/${productId}/reviews`,
      { params: { page: String(page), limit: String(limit) } },
    );
  },

  /**
   * Enviar una reseña (Requiere Auth)
   */
  submitReview: async (productId: string, data: CreateReviewInput, token: string) => {
    return api.post<{ message: string; review: Review }>(
      `/api/v1/user/marketplace/products/${productId}/reviews`, 
      data, 
      { token }
    );
  },

  /**
   * Obtener mi reseña en un producto (null si no existe). Requiere Auth.
   */
  getMyReview: async (productId: string, token: string) => {
    return api.get<{ review: Review | null }>(
      `/api/v1/user/marketplace/products/${productId}/reviews/mine`,
      { token },
    );
  },

  /**
   * Actualizar mi reseña. Requiere Auth.
   */
  updateReview: async (reviewId: string, data: UpdateReviewInput, token: string) => {
    return api.put<{ review: Review }>(
      `/api/v1/user/marketplace/reviews/${reviewId}`,
      data,
      { token },
    );
  },

  /**
   * Eliminar mi reseña. Requiere Auth.
   */
  deleteReview: async (reviewId: string, token: string) => {
    return api.delete<{ message: string }>(
      `/api/v1/user/marketplace/reviews/${reviewId}`,
      { token },
    );
  },

  /**
   * Listar reseñas para moderación (admin / super_admin). Requiere Auth.
   */
  adminListReviews: async (filter: AdminReviewFilter, token: string) => {
    const params: Record<string, string> = {};
    if (filter.status) params.status = filter.status;
    if (filter.rating) params.rating = String(filter.rating);
    if (filter.product_id) params.product_id = filter.product_id;
    if (filter.user_id) params.user_id = filter.user_id;
    if (filter.q) params.q = filter.q;
    if (filter.page) params.page = String(filter.page);
    if (filter.limit) params.limit = String(filter.limit);

    return api.get<AdminReviewListResponse>(
      "/api/v1/admin/marketplace/reviews",
      { params, token },
    );
  },

  /**
   * Editar el contenido (rating + comentario) de cualquier reseña.
   * Requiere super_admin.
   */
  adminUpdateReview: async (
    reviewId: string,
    data: UpdateReviewInput,
    token: string,
  ) => {
    return api.put<{ review: AdminReview }>(
      `/api/v1/admin/marketplace/reviews/${reviewId}`,
      data,
      { token },
    );
  },

  /**
   * Cambiar el status de una reseña (moderación). Requiere admin Auth.
   */
  adminSetReviewStatus: async (
    reviewId: string,
    status: ReviewStatus,
    token: string,
  ) => {
    const body: UpdateReviewStatusInput = { status };
    return api.patch<{ review: AdminReview }>(
      `/api/v1/admin/marketplace/reviews/${reviewId}`,
      body,
      { token },
    );
  },

  /**
   * Hard-delete admin de una reseña. Requiere admin Auth.
   */
  adminDeleteReview: async (reviewId: string, token: string) => {
    return api.delete<{ message: string }>(
      `/api/v1/admin/marketplace/reviews/${reviewId}`,
      { token },
    );
  },

  /**
   * Actualizar perfil de vendedor (Requiere Tenant Auth)
   */
  updateProfile: async (data: Partial<SellerProfile>, token: string, orgId: string) => {
    return api.put<void>("/api/v1/org/marketplace/seller-profile", data, { 
      token, 
      orgId 
    });
  },

  /**
   * Crear sesión de checkout para comprar un producto (Requiere Auth)
   */
  createCheckoutSession: async (productId: string, token: string, orgId: string, couponCode?: string) => {
    let returnUrl = "";
    if (typeof window !== "undefined") {
      returnUrl = window.location.href.split("?")[0];
    }
    
    const payload: { product_id: string; coupon_code?: string; return_url?: string } = { 
      product_id: productId,
      ...(returnUrl && { return_url: returnUrl })
    };
    if (couponCode) {
      payload.coupon_code = couponCode;
    }
    
    return api.post<CheckoutResponse>(
      "/api/v1/org/marketplace/checkout",
      payload,
      { token, orgId }
    );
  },

  /**
   * Verificar estado de una compra (Polling actively)
   */
  verifyPurchase: async (sessionId: string, token: string, orgId: string) => {
    return api.get<{ 
      status: string; 
      message?: string; 
      has_access: boolean;
      product_id?: string;
    }>(
      `/api/v1/org/marketplace/checkout/verify/${sessionId}`,
      { token, orgId }
    );
  }
};
